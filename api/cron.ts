import { waitUntil } from "@vercel/functions";
import type { PingResponse } from "./_ping";
import { regions } from "./_regions.js";
import {
  sendCampsiteMessage,
  sendDiscordMessage,
  sendSlackMessage,
  sendTelegramMessage,
} from "./_notifications.js";
import {
  getEnvRequests,
  getExternalRequests,
  getFileRequests,
} from "./_requests.js";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const FAILED_RATIO_THRESHOLD = 0.5;

export async function GET(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const start = Date.now();

  const allRequests = [
    // file,
    ...getFileRequests(),
    // fetch
    ...(await getExternalRequests()),
    // env
    ...getEnvRequests(),
  ];

  const fetchPromises = allRequests.flatMap((request) => {
    return regions.map(async (region) => {
      return fetch(`${BASE_URL}/api/edge/${region}`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PING_SECRET}`,
        },
      });
    });
  });

  try {
    const res = await Promise.allSettled(fetchPromises);

    const map = new Map<string, { total: number; ok: number }>();

    for (const result of res) {
      if (result.status === "rejected") {
        console.error(result.reason);
      } else if (result.status === "fulfilled") {
        try {
          console.log(result.value);
          const json = (await result.value.json()) as PingResponse;
          const key = `${json.method}:${json.url}`;
          const current = map.get(key) || { total: 0, ok: 0 };

          // REMINDER: simple assertion by checking if the status code starts with 2xx or 3xx
          // TODO: improve the assertion for dynamic use cases
          const isOk =
            `${json.status}`.startsWith("2") ||
            `${json.status}`.startsWith("3");

          map.set(key, {
            total: current.total + 1,
            ok: current.ok + Number(isOk),
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }

    Array.from(map.entries()).forEach(async ([key, value]) => {
      const ratio = value.ok / value.total;
      if (ratio > FAILED_RATIO_THRESHOLD) return;

      const message = `🚨 ${key} has ${value.ok}/${value.total} successful requests`;

      waitUntil(sendSlackMessage(message));
      waitUntil(sendDiscordMessage(message));
      waitUntil(sendCampsiteMessage(message));
      waitUntil(sendTelegramMessage(message));
    });

    const end = Date.now();

    return new Response(`${fetchPromises.length} requests in ${end - start}ms`);
  } catch (error) {
    console.error(error);

    return new Response("Internal Server Error", { status: 500 });
  }
}

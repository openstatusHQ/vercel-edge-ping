import { waitUntil } from "@vercel/functions";
import { ping } from "../_ping";
import { ingest } from "../_db";

export const config = {
  runtime: "edge",
  regions: ["sin1"],
};

export default async function handler(req: Request): Promise<Response> {
  const region = process.env.VERCEL_REGION || "unknown";
  const authHeader = req.headers.get("authorization");

  if (
    !process.env.PING_SECRET ||
    authHeader !== `Bearer ${process.env.PING_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method !== "POST") {
    return new Response(`Method Not Allowed ('${region}')`, { status: 405 });
  }

  const body = await req.json();
  const res = await ping(body);

  waitUntil(ingest([res]));

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
}

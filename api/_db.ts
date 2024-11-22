import type { PingResponse } from "./_ping";

const DATASOURCE_NAME = "http_ping_responses__v0";

export async function ingest(requests: PingResponse[]): Promise<void> {
  if (!process.env.TINYBIRD_TOKEN) return;

  const body = requests
    // REMINDER: avoid nested objects like `headers` in the payload - instead stringify them
    .map((p) => JSON.stringify({ ...p, headers: JSON.stringify(p.headers) }))
    .join("\n");

  const res = await fetch(
    `https://api.tinybird.co/v0/events?name=${DATASOURCE_NAME}&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
      body,
    }
  );
}

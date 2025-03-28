const EVENT_NAME = "endpoint__get_http_stats__v0";

export async function GET(req: Request) {
  if (!process.env.TINYBIRD_TOKEN) {
    return new Response("No Connected Database", { status: 200 });
  }

  const reqUrl = new URL(req.url);
  const searchParams = reqUrl.searchParams;
  const interval = searchParams.get("interval");
  const timestampStart = searchParams.get("timestampStart");
  const timestampEnd = searchParams.get("timestampEnd");

  const tbUrl = new URL(`https://api.tinybird.co/v0/pipes/${EVENT_NAME}.json`);

  // Only set params if they are provided
  if (interval) tbUrl.searchParams.set("interval", interval); // in minutes
  if (timestampStart) tbUrl.searchParams.set("timestampStart", timestampStart); // in unix timestamp
  if (timestampEnd) tbUrl.searchParams.set("timestampEnd", timestampEnd); // in unix timestamp

  const result = await fetch(tbUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
    },
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (!result?.data) {
    console.error(`Error with: ${JSON.stringify(result)}`);
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}

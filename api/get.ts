const EVENT_NAME = "endpoint__get_http__v0";

export async function GET() {
  if (!process.env.TINYBIRD_TOKEN) {
    return new Response("No Connected Database", { status: 200 });
  }

  const result = await fetch(
    `https://api.tinybird.co/v0/pipes/${EVENT_NAME}.json`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
    }
  )
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (!result?.data) {
    console.error(`Error with: ${JSON.stringify(result)}`);
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(JSON.stringify(result.data), {
    headers: { "Content-Type": "application/json" },
  });
}
const EVENT_NAME = "endpoint__get_http__v0";

// TODO: add filters and more

export async function GET(req: Request) {
  if (!process.env.TINYBIRD_TOKEN) {
    return new Response("No Connected Database", { status: 200 });
  }

  const reqUrl = new URL(req.url);
  const searchParams = reqUrl.searchParams;
  const pageIndex = searchParams.get("pageIndex");
  const pageSize = searchParams.get("pageSize");
  const orderBy = searchParams.get("orderBy");
  const orderDir = searchParams.get("orderDir");
  const latencyStart = searchParams.get("latencyStart");
  const latencyEnd = searchParams.get("latencyEnd");
  const url = searchParams.get("url");
  // REMINDER: can be comma separated list as tb supports arrays.
  const statuses = searchParams.get("statuses");
  const methods = searchParams.get("methods");
  const regions = searchParams.get("regions");

  const tbUrl = new URL(`https://api.tinybird.co/v0/pipes/${EVENT_NAME}.json`);

  // Only set params if they are provided
  if (pageIndex) tbUrl.searchParams.set("pageIndex", pageIndex);
  if (pageSize) tbUrl.searchParams.set("pageSize", pageSize);
  if (orderBy) tbUrl.searchParams.set("orderBy", orderBy);
  if (orderDir) tbUrl.searchParams.set("orderDir", orderDir);
  if (latencyStart) tbUrl.searchParams.set("latencyStart", latencyStart);
  if (latencyEnd) tbUrl.searchParams.set("latencyEnd", latencyEnd);
  if (statuses) tbUrl.searchParams.set("statuses", statuses);
  if (methods) tbUrl.searchParams.set("methods", methods);
  if (regions) tbUrl.searchParams.set("regions", regions);
  if (url) tbUrl.searchParams.set("url", url);

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

  return new Response(JSON.stringify(result.data), {
    headers: { "Content-Type": "application/json" },
  });
}

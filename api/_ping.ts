export type PingRequest = {
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  timeout?: number;
  /**
   * Whether to prewarm your endpoint before timing the next request.
   * This is useful to avoid cold starts.
   */
  prewarm?: boolean;
};

export type PingResponse = {
  url: string;
  method: string;
  status?: number;
  latency?: number;
  body?: string;
  headers?: Record<string, string>;
  error?: string;
  timestamp: number;
  region: string;
};

export async function ping(request: PingRequest): Promise<PingResponse> {
  const region = process.env.VERCEL_REGION || "unknown";

  if (request.prewarm) {
    console.log(`Prewarming the request in '${region}'...`);
    await check(request);
    console.log(`Prewarming in '${region}' completed.`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1s before firing the next request
  }

  try {
    // TODO: make it in a try/catch block instead?
    // REMINDER: we retry once if the request fails to make sure it's not a transient issue
    const res = await check(request).catch((e) => {
      console.error(`Request failed with ${e} in '${region}'. Retrying...`);
      return check(request);
    });
    console.log(`Request succeded in '${region}'.`);

    return res;
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error(`Request failed again with ${e} in '${region}'.`);

    return {
      error,
      url: request.url,
      method: request.method,
      timestamp: Date.now(),
      region,
    };
  }
}

async function check(request: PingRequest): Promise<PingResponse> {
  const region = process.env.VERCEL_REGION || "unknown";
  const timeout = request.timeout || 50_000; // default 50s
  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(new Error(`Request timeout after ${timeout}ms.`)),
    timeout
  );

  const start = Date.now();
  const res = await fetch(request.url, {
    method: request.method,
    headers: {
      "User-Agent": "OpenStatus/1.0",
      ...request.headers,
    },
    body: request.body,
    signal: controller.signal,
  });
  const end = Date.now();

  clearTimeout(timeoutId);

  const latency = end - start;
  const body = (await res.text()).slice(0, 1000); // limit to 1000 characters to avoid saving large payloads in tb
  const headers = Object.fromEntries(res.headers.entries());

  return {
    url: request.url,
    method: request.method,
    region,
    status: res.status,
    latency,
    body,
    headers,
    timestamp: start,
  };
}

import fs from "fs";
import path from "path";
import type { PingRequest } from "./_ping";

/**
 *
 * @returns List of file requests to ping from resources.json.
 */
export const getFileRequests = (): PingRequest[] => {
  const resourcesPath = path.join(process.cwd(), "./api/resources.json");
  const file = fs.readFileSync(resourcesPath);
  const data = JSON.parse(file.toString());

  if (!validateData(data)) {
    console.error("Invalid resources.json file.");
    return [];
  }

  return data;
};

/**
 *
 * @returns List of external requests to ping.
 */
export async function getExternalRequests(): Promise<PingRequest[]> {
  if (!process.env.EXTERNAL_REQUESTS_URL) return [];

  const res = await fetch(process.env.EXTERNAL_REQUESTS_URL, {
    headers: {
      Authorization: `Bearer ${process.env.EXTERNAL_REQUESTS_SECRET}`,
    },
  });
  const data = await res.json();

  if (!validateData(data)) {
    console.error(`Invalid ${process.env.EXTERNAL_REQUESTS_URL} return data.`);
    return [];
  }

  return data;
}

/**
 *
 * @returns List of requests to ping from the environment variables.
 */
export function getEnvRequests(): PingRequest[] {
  if (!process.env.REQUESTS) return [];

  const data = JSON.parse(process.env.REQUESTS);

  if (!validateData(data)) {
    console.error("Invalid REQUESTS environment variable.");
    return [];
  }

  return data;
}

/**
 *
 * @param data any input source like fetch or env
 * @returns true if the data is a valid PingRequest array
 */
function validateData(data: any): data is PingRequest[] {
  return (
    Array.isArray(data) &&
    data.every((r) => {
      return (
        typeof r === "object" &&
        typeof r.url === "string" &&
        typeof r.method === "string" &&
        (typeof r.timeout === "number" || r.timeout === undefined) &&
        (typeof r.prewarm === "boolean" || r.prewarm === undefined) &&
        (typeof r.headers === "object" || r.headers === undefined) &&
        (typeof r.body === "string" || r.body === undefined)
      );
    })
  );
}

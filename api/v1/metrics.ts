export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  console.log("metrics", { request });
  return new Response("OK", { status: 200 });
}

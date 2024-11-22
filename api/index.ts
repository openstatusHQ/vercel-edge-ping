export const config = {
  runtime: "edge",
};

const region = process.env.VERCEL_REGION || "unknown";

export async function GET(): Promise<Response> {
  const text = `
  <html>
    <head>
      <title>OpenStatus | Vercel Edge Ping</title>
    </head>
    <body>
      <h1>OpenStatus | Vercel Edge Ping</h1>
      <p>
        Your request has been executed in region <code>${region}</code>.
      </p>
      <p>By default, a cron job will run every day at 00:00 UTC to send a request to <a href="/api/cron">/api/cron</a> and ping the following regions:</p>
      <ul>
        <li><a href="/api/edge/arn1">/api/edge/arn1</a></li>
        <li><a href="/api/edge/bom1">/api/edge/bom1</a></li>
        <li><a href="/api/edge/cdg1">/api/edge/cdg1</a></li>
        <li><a href="/api/edge/cle1">/api/edge/cle1</a></li>
        <li><a href="/api/edge/cpt1">/api/edge/cpt1</a></li>
        <li><a href="/api/edge/dub1">/api/edge/dub1</a></li>
        <li><a href="/api/edge/fra1">/api/edge/fra1</a></li>
        <li><a href="/api/edge/gru1">/api/edge/gru1</a></li>
        <li><a href="/api/edge/hkg1">/api/edge/hkg1</a></li>
        <li><a href="/api/edge/hnd1">/api/edge/hnd1</a></li>
        <li><a href="/api/edge/iad1">/api/edge/iad1</a></li>
        <li><a href="/api/edge/icn1">/api/edge/icn1</a></li>
        <li><a href="/api/edge/kix1">/api/edge/kix1</a></li>
        <li><a href="/api/edge/lhr1">/api/edge/lhr1</a></li>
        <li><a href="/api/edge/pdx1">/api/edge/pdx1</a></li>
        <li><a href="/api/edge/sfo1">/api/edge/sfo1</a></li>
        <li><a href="/api/edge/sin1">/api/edge/sin1</a></li>
        <li><a href="/api/edge/syd1">/api/edge/syd1</a></li>
      </ul>
      <p>
        Get the latest cron requests by visiting <a href="/api/get">/api/get</a>.
      </p>
      <p>
        Read more on <a href="https://github.com/openstatusHQ/vercel-edge-ping">GitHub</a>
        &#183;
        Build with <a href="https://vercel.com">Vercel</a> and <a href="https://tinybird.co">Tinybird</a>
        &#183;
        Powered by <a href="https://openstatus.dev">OpenStatus</a>
      </p>
      </html>
  `;

  return new Response(text, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

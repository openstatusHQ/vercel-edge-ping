export const config = {
  runtime: "edge",
};

const region = process.env.VERCEL_REGION || "unknown";

const META_DESCRIPTION =
  "Lightweight one-click solution to monitor your endpoints across multiple regions.";
const META_TITLE = "OpenStatus | Vercel Edge Ping";
const META_URL = "https://light.openstatus.dev";
const META_OG_IMAGE =
  "https://www.openstatus.dev/api/og?title=Vercel%20Edge%20Ping&description=Lightweight%20one-click%20solution%20to%20monitor%20your%20endpoints%20across%20multiple%20regions.&footer=light.openstatus.dev";

export async function GET(): Promise<Response> {
  const text = `
  <html>
    <head>
      <title${META_TITLE}</title>
      <meta name="description" content="${META_DESCRIPTION}">

      <meta property="og:url" content="${META_URL}">
      <meta property="og:type" content="website">
      <meta property="og:title" content="${META_TITLE}">
      <meta property="og:description" content="${META_DESCRIPTION}">
      <meta property="og:image" content="${META_OG_IMAGE}">

      <meta name="twitter:card" content="summary_large_image">
      <meta property="twitter:domain" content="${META_URL}">
      <meta property="twitter:url" content="${META_URL}">
      <meta name="twitter:title" content="${META_TITLE}">
      <meta name="twitter:description" content="${META_DESCRIPTION}">
      <meta name="twitter:image" content="${META_OG_IMAGE}">
    </head>
    <body>
      <h1>${META_TITLE}</h1>
      <p>
        Lightweight open-source one-click solution to monitor your endpoints across multiple regions.
      </p>
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
        Be notified via Slack, Discord, Campsite or Telegram if >50% of the regions are down.
      </p>
      <p>More endpoints (with search params support):</p>
      <ul>
        <li>Get the latest requests by visiting <a href="/api/get">/api/get</a>.</li>
        <li>Get the latest stats by visiting <a href="/api/stats">/api/stats</a>.</li>
        <li>Get the latest facets by visiting <a href="/api/facets">/api/facets</a>.</li>
      </ul>
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

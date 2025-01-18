import { trace, context, SpanStatusCode } from "@opentelemetry/api";

export async function GET(request: Request): Promise<Response> {
  const tracer = trace.getTracer("vercel-edge-ping");
  console.log({ tracer });
  tracer.startActiveSpan("test", async (span) => {
    try {
      await someFnThatMightThrowError();
      span.end();
      return new Response("OK", { status: 200 });
    } catch (e) {
      if (e instanceof Error) {
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      }
      throw e;
    }
  });

  console.log({ tracer });

  return new Response("OK", { status: 200 });
}

async function someFnThatMightThrowError() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const shouldError = Math.random() > 0.9;
  if (shouldError) {
    console.log("Error");
    throw new Error("Random test error occurred");
  }
}

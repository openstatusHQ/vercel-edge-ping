import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "vercel-edge-ping",
    // traceExporter: process.env.NODE_ENV === "production" ? new AlwaysOnSampler() : new TraceIdRatioBasedSampler(0.1),
  });
}

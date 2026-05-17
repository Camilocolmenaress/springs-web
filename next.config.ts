import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "camilo-colmenares",
  project: "springs-web",
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true,
  },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: false,
  },
});

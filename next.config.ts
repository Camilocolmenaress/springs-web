import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "camilo-colmenares",
  project: "springs-web",
  silent: true,
  automaticVercelMonitors: false,
  sourcemaps: {
    disable: true,
  },
});

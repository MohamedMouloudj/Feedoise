import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 80, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "ar"],
    models: "lingo.dev",
    buildMode: "cache-only",
    dev: {
      usePseudotranslator: false,
    },
  });
}

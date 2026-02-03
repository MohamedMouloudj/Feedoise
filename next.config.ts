import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  // Your existing Next.js config
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "ru", "fr", "ar", "zh", "hi", "pt"],
    models: "lingo.dev",
    buildMode: "translate",
    dev: {
      usePseudotranslator: false,
    },
  });
}

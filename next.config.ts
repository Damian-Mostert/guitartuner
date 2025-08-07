// next.config.js or next.config.ts
import type { NextConfig } from "next";
import { join } from "path";
import { writeFileSync, mkdirSync, existsSync } from "fs";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      const version = Date.now().toString();
      const outputDir = join(process.cwd(), ".next", "static");
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      writeFileSync(
        join(outputDir, "version.json"),
        JSON.stringify({ buildId: version }, null, 2)
      );
    }
    return config;
  },
};

export default nextConfig;

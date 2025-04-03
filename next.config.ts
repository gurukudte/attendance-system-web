import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Use raw-loader to handle .html files
    config.module.rules.push({
      test: /\.html$/,
      use: "raw-loader",
    });

    return config;
  },
};

export default nextConfig;

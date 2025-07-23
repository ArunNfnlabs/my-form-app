import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 This enables static export
  trailingSlash: true, // optional, if you want /about/ instead of /about
};

export default nextConfig;

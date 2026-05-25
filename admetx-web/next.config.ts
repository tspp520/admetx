import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ketcher-react and ketcher-standalone ship ESM that needs transpiling for Next.js.
  transpilePackages: ['ketcher-react', 'ketcher-standalone', 'ketcher-core'],
};

export default nextConfig;

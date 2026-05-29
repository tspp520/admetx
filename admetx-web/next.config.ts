import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ketcher-react and ketcher-standalone ship ESM that needs transpiling for Next.js.
  transpilePackages: ['ketcher-react', 'ketcher-standalone', 'ketcher-core'],
  async headers() {
    return [
      {
        // Prevent browsers from caching the /ketcher iframe page across deploys.
        // The JS chunks it references are content-hashed (immutable) so they don't
        // need this; only the HTML shell does.
        source: '/ketcher',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default nextConfig;

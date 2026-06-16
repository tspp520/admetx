import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ketcher-react and ketcher-standalone ship ESM that needs transpiling for Next.js.
  transpilePackages: ['ketcher-react', 'ketcher-standalone', 'ketcher-core'],
  // We build with webpack (next build --webpack): Turbopack mangles ketcher-standalone's
  // indigo Web Worker URL (references the un-hashed name → 404 → editor never inits).
  // ketcher-core pulls paper.js, whose node build requires jsdom/canvas; those node-only
  // paths are never hit in the browser, so stub them to false to let webpack compile.
  webpack: (config: { resolve?: { alias?: Record<string, unknown> } }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      jsdom: false,
      canvas: false,
    };
    return config;
  },
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

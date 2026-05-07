import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a standalone output bundle — ideal for Docker / custom Vercel builds.
  // Vercel's native Next.js integration handles this automatically, so this
  // option is commented out here; un-comment if deploying via Docker.
  // output: "standalone",

  // Strict React mode for catching potential issues early.
  reactStrictMode: true,

  // Allow images served from the production domain once it is set.
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SITE_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname,
          },
        ]
      : [],
  },

  // Expose the site URL to client-side code.
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  },
};

export default nextConfig;

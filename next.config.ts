import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone bundle for Docker/Render deployments.
  output: "standalone",

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

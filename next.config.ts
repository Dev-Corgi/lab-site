import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "denbxsedjgrmeunmigou.supabase.co" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) return [];
      try {
        const { hostname } = new URL(url);
        return [{ protocol: "https", hostname }];
      } catch {
        return [];
      }
    })(),
  },
};

export default nextConfig;

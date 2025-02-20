import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.16.146.58",
        port: "3333",
        search: "",
      },
    ],
  },
};

export default nextConfig;

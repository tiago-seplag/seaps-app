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
  env: {
    BASE_URL: process.env.BASE_URL,
    BUCKET_URL: process.env.BUCKET_URL,
    REPORT_URL: process.env.REPORT_URL,
  },
};

export default nextConfig;

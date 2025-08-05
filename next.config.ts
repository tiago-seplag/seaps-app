import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["knex"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.16.44.56",
        port: "3000",
        search: "",
      },
      {
        protocol: "https",
        hostname: "192.168.171.252",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "jrgxeplrqwsmntjfhakb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "smp.seplag.mt.gov.br",
      },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    BUCKET_URL: process.env.BUCKET_URL,
    MT_LOGIN_CLIENT_ID: process.env.MT_LOGIN_CLIENT_ID,
    MT_LOGIN_URL: process.env.MT_LOGIN_URL,
    REPORT_URL: process.env.REPORT_URL,
  },
  output: "standalone",
};

export default nextConfig;

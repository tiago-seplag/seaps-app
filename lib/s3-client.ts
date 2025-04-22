import { S3Client } from "@aws-sdk/client-s3";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_BUCKET_URL!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export { s3Client };

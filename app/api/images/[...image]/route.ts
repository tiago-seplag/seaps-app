import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const s3 = new S3Client({
  forcePathStyle: true,
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_BUCKET_URL!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ image: string }> },
) {
  const { image } = await params;

  if (!image) {
    return new NextResponse("Missing key", { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: image.toString().replaceAll(",", "/"),
    });

    const s3Response = await s3.send(command);

    const stream = s3Response.Body as ReadableStream;

    const body = await new Response(stream).arrayBuffer();
    const contentType = s3Response.ContentType || "application/octet-stream";

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Erro ao buscar imagem", { status: 500 });
  }
}

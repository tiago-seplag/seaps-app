import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return new NextResponse("Missing key", { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const s3Response = await s3.send(command);

    // `Body` é um stream Readable, vamos transformar num buffer
    const stream = s3Response.Body as ReadableStream;

    const body = await new Response(stream).arrayBuffer();
    const contentType = s3Response.ContentType || "application/octet-stream";

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=300", // cache opcional
      },
    });
  } catch (err) {
    console.error("Erro ao buscar imagem do S3:", err);
    return new NextResponse("Erro ao buscar imagem", { status: 500 });
  }
}

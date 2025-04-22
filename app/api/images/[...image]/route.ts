import { s3Client } from "@/lib/s3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

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

    const s3Response = await s3Client.send(command);

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
    return new NextResponse(
      JSON.stringify({ error: "Erro ao buscar imagem", detail: err }),
      {
        status: 404,
      },
    );
  }
}

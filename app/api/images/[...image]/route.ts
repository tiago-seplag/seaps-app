import { s3Client } from "@/lib/s3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ image: string }> },
) {
  const searchParams = request.nextUrl.searchParams;

  const compress = searchParams.get("compress");

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

    if (compress) {
      const compressedImageBuffer = await sharp(body)
        .resize({ width: 240, height: 200 }) // Example: Resize the image
        .jpeg({ quality: 70 })
        .toBuffer();

      return new NextResponse(compressedImageBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(compressedImageBuffer.byteLength),
          "Cache-Control": "public, max-age=300",
        },
      });
    }

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

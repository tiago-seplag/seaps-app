// import { s3Client } from "@/lib/s3-client";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
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
    // const command = new GetObjectCommand({
    //   Bucket: process.env.S3_BUCKET_NAME!,
    //   Key: image.toString().replaceAll(",", "/"),
    // });

    // const s3Response = await s3Client.send(command);

    // const stream = s3Response.Body as ReadableStream;

    const response = await axios.get(
      `http://172.24.155.34:3334/images/image${Math.floor(Math.random() * 15) + 1}.webp`,
      {
        responseType: "arraybuffer",
      },
    );

    const imageData = Buffer.from(response.data, "binary");

    // const contentType = s3Response.ContentType || "application/octet-stream";

    if (compress) {
      const body = Buffer.from(response.data, "binary");
      const compressedImageBuffer = await sharp(body)
        .resize({ width: 240, height: 200 }) // Example: Resize the image
        .jpeg({ quality: 70 })
        .toBuffer();

      return new NextResponse(compressedImageBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": String(compressedImageBuffer.byteLength),
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return new NextResponse(imageData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(imageData.byteLength),
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

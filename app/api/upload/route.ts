/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { withMiddlewares } from "@/utils/handler";
import { authMiddleware } from "@/utils/authentication";
import { s3Client } from "@/lib/s3-client";

async function uploadFileToS3(file: Buffer, fileName: string) {
  try {
    const fileBuffer = file;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${fileName}`,
      Body: fileBuffer,
      ContentType: "image/jpg",
    };

    const command = new PutObjectCommand({ ...params, ACL: "public-read" });
    await s3Client.send(command);
    return fileName;
  } catch (error) {
    console.log("err->", error);
    throw new Error("erro ao fazer upload");
  }
}

function generateFileName(type: string) {
  const uuid = randomUUID().replace(/\-/g, "");

  return uuid + "." + type.split("/")[1];
}

const postHandler = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file: any = formData.getAll("file");
    const folder = formData.get("folder");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const files = [];

    for (const image of file) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `accept only images` },
          { status: 422 },
        );
      }
      if (image.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: `max file size is 4mb` },
          { status: 422 },
        );
      }
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = generateFileName(image.type);

      const uploadedFile = await uploadFileToS3(
        buffer,
        folder + "/" + fileName,
      );

      files.push({ url: "/" + uploadedFile });
    }

    return NextResponse.json({ success: true, fileName: file.name, files });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = withMiddlewares([authMiddleware], postHandler);

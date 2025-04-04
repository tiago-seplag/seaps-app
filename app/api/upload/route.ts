/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { withMiddlewares } from "@/utils/handler";
import { authMiddleware } from "@/utils/authentication";

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.AWS_S3_BUCKET_URL!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { s3Client } from "@/lib/s3-client";

import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs/promises";
import controller, { handler } from "@/infra/controller";
import checklistItem from "@/models/checklist-item";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRequestBuffer(req: NextRequest): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    if (value) chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

function generateFileName(type: string) {
  const uuid = randomUUID().replace(/\-/g, "");

  return uuid + "." + type.split("/")[1];
}

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

async function postHandler(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  await params;
  try {
    const buffer = await getRequestBuffer(req);

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const stream = Readable.from(buffer);
    const fakeReq = Object.assign(stream, {
      headers,
      method: req.method,
      url: "",
    });

    const form = formidable({ multiples: true });
    const { files } = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(fakeReq as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      },
    );

    const folder = "image";
    const responseFiles = [];

    const images = Array.isArray(files.file) ? files.file : [files.file];

    for (const image of images) {
      if (!image.mimetype?.startsWith("image/")) {
        return NextResponse.json(
          { error: "accept only images" },
          { status: 422 },
        );
      }
      if (image.size > 20 * 1024 * 1024) {
        return NextResponse.json(
          { error: "max file size is 10MB" },
          { status: 422 },
        );
      }

      const buffer = await fs.readFile(image.filepath);
      const fileName = generateFileName(image.mimetype);

      const uploadedFile = await uploadFileToS3(
        buffer,
        folder + "/" + fileName,
      );

      responseFiles.push({
        image: "/" + uploadedFile,
        size: buffer.length,
        format: image.mimetype as string,
      });
    }

    await checklistItem.saveImages((await params).itemId, responseFiles);

    return NextResponse.json({ success: true, files: responseFiles });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const POST = handler([controller.authenticate], postHandler);

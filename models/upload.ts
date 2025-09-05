import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

const upload = { uploadFileToS3 };

export default upload;

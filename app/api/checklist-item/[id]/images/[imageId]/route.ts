import { prisma } from "@/lib/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3-client";

async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { imageId } = await params;
  const data = await request.json();

  const observation = data.observation;

  const updatedImage = await prisma.checklistItemImages.update({
    data: {
      observation,
    },
    where: {
      id: imageId,
    },
  });

  return Response.json(updatedImage);
}

async function deleteHandler(
  _: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { imageId, id } = await params;

  const image = await prisma.checklistItemImages.findUnique({
    where: {
      id: imageId,
    },
  });

  const checklistItem = await prisma.checklistItems.findUnique({
    where: {
      id: id,
    },
  });

  if (!image || !checklistItem) {
    return new NextResponse("Image not found", { status: 404 });
  }

  try {
    const commnad = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: image.image.slice(1),
    });

    await s3Client.send(commnad);

    if (image.image === checklistItem.image) {
      await prisma.checklistItems.update({
        data: {
          image: "",
        },
        where: {
          id: checklistItem.id,
        },
      });
    }

    await prisma.checklistItemImages.delete({
      where: {
        id: image.id,
      },
    });

    return Response.json({ [image.id]: "deleted" });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ erro: "erro ao deletar imagem", details: error }),
      { status: 500 },
    );
  }
}

export const PUT = withMiddlewares([authMiddleware], putHandler);
export const DELETE = withMiddlewares([authMiddleware], deleteHandler);

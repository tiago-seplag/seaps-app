import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";
import controller, { handler } from "@/infra/controller";
import checklistItem from "@/models/checklist-item";
import checklist from "@/models/checklist";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { db } from "@/infra/database";

async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { id, imageId } = await params;

  const item = await checklistItem.findById(id);

  const data = await request.json();

  const observation = data.observation;

  const [image] = await db("checklist_item_images")
    .update({
      observation,
    })
    .where("id", imageId)
    .returning("*");

  await checklist.createLog({
    action: "checklist_item_images:update",
    checklist_item_id: item.id,
    checklist_id: item.checklist_id,
    user_id: request.headers.get("x-user-id")!,
    value: { observation },
  });

  return Response.json(image);
}

async function deleteHandler(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { imageId, id } = await params;

  const item = await checklistItem.findById(id);

  if (!item) {
    throw new NotFoundError({
      message: "Item não encontrado",
      action: "Verifique o ID do item.",
    });
  }

  const _checklist = await checklist.findById(item.checklist_id);

  if (_checklist.status === "CLOSED") {
    throw new ValidationError({
      message: "",
      action: "",
    });
  }

  const images = await db("checklist_item_images").where(
    "checklist_item_id",
    item.id,
  );

  const image = images.find((img) => img.id === imageId);

  if (!image) {
    throw new ValidationError({
      message: "",
      action: "",
    });
  }

  const commnad = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: image.image.slice(1),
  });

  await s3Client.send(commnad);

  const filteredImages = images.filter((img) => img.id !== image.id);
  if (image.image === item.image) {
    await checklistItem.update(
      item.id,
      {
        image: filteredImages[0]?.image || "",
        score: item.score,
      },
      {
        id: request.headers.get("x-user-id")!,
        permissions:
          request.headers.get("x-user-permissions")?.split(",") || [],
      },
    );
  }

  await db("checklist_item_images").where("id", image.id).delete();

  await checklist.createLog({
    action: "checklist_item_images:delete",
    checklist_item_id: item.id,
    checklist_id: item.checklist_id,
    user_id: request.headers.get("x-user-id")!,
    value: { image_id: image.id },
  });

  return Response.json({ [image.id]: "deleted" });
}

export const PUT = handler([controller.authenticate], putHandler);
export const DELETE = handler([controller.authenticate], deleteHandler);

import { db } from "@/infra/database";
import { ForbiddenError, NotFoundError, ValidationError } from "@/infra/errors";
import { z } from "zod";

export const updateSchema = z
  .object({
    score: z
      .string()
      .optional()
      .transform((value) => typeof value === "number" && isFinite(value)),
    observation: z.string().optional(),
    image: z.string().optional(),
  })
  .strict();

export const validateSchema = z
  .object({
    is_valid: z.boolean(),
  })
  .strict();

export type UpdateChecklistItemSchema = z.infer<typeof updateSchema>;

export async function getChecklistItems(checklistId: string) {
  const checklistItems = await db("checklist_items")
    .select(
      "checklist_items.*",
      "items.id as item:id",
      "items.name as item:name",
    )
    .where("checklist_items.checklist_id", checklistId)
    .innerJoin("items", "items.id", "checklist_items.item_id")
    .orderBy("items.name")
    .nest();

  if (checklistItems.length === 0) {
    throw new NotFoundError({
      message: "Nenhum item de checklist encontrado",
      action: "Verifique se o ID do checklist está correto",
    });
  }

  return checklistItems;
}

export async function getChecklistItemById(id: string) {
  const checklistItem = await db("checklist_items")
    .select(
      "checklist_items.*",
      "items.id as item:id",
      "items.name as item:name",
    )
    .where("checklist_items.id", id)
    .innerJoin("items", "items.id", "checklist_items.item_id")
    .first()
    .nest();

  if (!checklistItem) {
    throw new NotFoundError({
      message: "Esse ID de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  const images = await db("checklist_item_images").where(
    "checklist_item_id",
    id,
  );

  return { ...checklistItem, images };
}

export async function updateChecklistItem(
  id: string,
  data: UpdateChecklistItemSchema,
  user: {
    id: string;
    role: string;
    permissions?: string[];
  },
) {
  const checklistItem = await db("checklist_items")
    .select("checklist_items.*")
    .select(
      "checklists.id as checklist:id",
      "checklists.user_id as checklist:user_id",
      "checklists.status as checklist:status",
    )
    .where("checklist_items.id", id)
    .innerJoin("checklists", "checklists.id", "checklist_items.checklist_id")
    .first()
    .nest();

  if (checklistItem.checklist.status === "CLOSED") {
    throw new ValidationError({
      message: "Esse checklist está fechado",
      action: "Verifique o status do checklist",
    });
  }

  if (
    checklistItem?.checklist.user_id !== user.id &&
    !user.permissions?.includes("checklist_items:edit_all") &&
    !user.permissions?.includes("*")
  ) {
    throw new ForbiddenError({
      message: "Apenas o responsável pode editar o item",
      action: "Pessa ao responsável para realizar o checklist",
    });
  }

  const updateData: {
    observation?: string;
    score?: number;
    image?: string;
    is_inspected?: boolean;
  } = {};

  if (data.observation) {
    updateData.observation = data.observation;
  }

  if (data.score) {
    updateData.score = Number(data.score);
    updateData.is_inspected = true;
  }

  if (data.image) {
    updateData.image = data.image;
  }

  const [updatedChecklistItem] = await db("checklist_items")
    .update(updateData)
    .where("id", id)
    .returning("*");

  return updatedChecklistItem;
}

async function validate(
  data: z.infer<typeof validateSchema>,
  { itemId, checklistId }: { itemId: string; checklistId: string },
) {
  const checklistItem = await db("checklist_items")
    .where({ id: itemId, checklist_id: checklistId })
    .first();

  if (!checklistItem) {
    throw new NotFoundError({
      message: "Esse item de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  const updatedChecklistItem = await db("checklist_items")
    .update({ is_valid: data.is_valid })
    .where({ id: itemId, checklist_id: checklistId })
    .returning("*");

  return updatedChecklistItem[0];
}

async function saveImages(
  checklistItemId: string,
  images: {
    image: string;
    size: number;
    format: string;
  }[],
) {
  await db("checklist_items")
    .update({ image: images[0].image })
    .where("id", checklistItemId);

  await db("checklist_item_images").insert(
    images.map((image) => ({
      checklist_item_id: checklistItemId,
      ...image,
    })),
  );
}

const checklistItem = {
  findAll: getChecklistItems,
  findById: getChecklistItemById,
  update: updateChecklistItem,
  validate,
  saveImages,
  schemas: {
    validate: validateSchema,
    update: updateSchema,
  },
};

export default checklistItem;

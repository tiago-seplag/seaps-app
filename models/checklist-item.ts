import { db } from "@/infra/database";
import { ForbiddenError, NotFoundError } from "@/infra/errors";
import { z } from "zod";

export const updateChecklistItemSchema = z
  .object({
    score: z
      .string()
      .optional()
      .transform((value) => typeof value === "number" && isFinite(value)),
    observation: z.string().optional(),
    image: z.string().optional(),
  })
  .strict();

export type UpdateChecklistItemSchema = z.infer<
  typeof updateChecklistItemSchema
>;

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
  },
) {
  const checklistItem = await db("checklist_items")
    .select("checklist_items.*")
    .select(
      "checklists.id as checklist:id",
      "checklists.user_id as checklist:user_id",
    )
    .where("checklist_items.id", id)
    .innerJoin("checklists", "checklists.id", "checklist_items.checklist_id")
    .first()
    .nest();

  if (
    checklistItem?.checklist.user_id !== user.id &&
    user.role === "EVALUATOR"
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
  } = {};

  if (data.observation) {
    updateData.observation = data.observation;
  }

  if (data.score) {
    updateData.score = Number(data.score);
  }

  if (data.image) {
    updateData.image = data.image;
  }

  const updatedChecklistItem = await db("checklist_items")
    .update(updateData)
    .where("id", id)
    .returning("*");

  return updatedChecklistItem;
}

const checklistItem = {
  findAll: getChecklistItems,
  findById: getChecklistItemById,
  update: updateChecklistItem,
  updateSchema: updateChecklistItemSchema,
};

export default checklistItem;

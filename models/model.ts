import { db } from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { z } from "zod";

import item from "@/models/item";

export const createModelSchema = z.object({
  name: z
    .string({
      message: "Insira o nome do Modelo",
    })
    .min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Insira o nome do Item" }),
      }),
    )
    .min(1, {
      message: "Insira ao menos um Item",
    }),
});

type TCreateModelSchema = z.infer<typeof createModelSchema>;

interface Model {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function paginatedModels(page = 1, perPage = 10) {
  const models = await db("models")
    .select("models.*")
    .orderBy("models.created_at", "asc")
    .paginate(page, perPage);

  return models;
}

async function getModelById(id: string) {
  const model = await db("models")
    .select("models.*")
    .where("models.id", id)
    .first();

  if (!model) {
    throw new NotFoundError({
      message: "Modelo não encontrado.",
      action: "Verifique o ID fornecido.",
    });
  }

  return model;
}

async function createModel(data: TCreateModelSchema) {
  const { items, ...model } = data;

  const findModel = await findModelByName(model.name);

  if (findModel) {
    if (findModel.is_active) {
      throw new ValidationError({
        message: "Esse Modelo já existe.",
        action: "Escolha um nome diferente para o modelo.",
      });
    }

    throw new ValidationError({
      message: "Esse Modelo já existe, mas está inativo.",
      action: "Você pode reativá-lo ou escolher um nome diferente.",
    });
  }

  const list = [];

  for (const i of items) {
    const findedItem = await item.findOrInsert(i);

    list.push(findedItem.id);
  }

  const createdModel = await insertModel(model);

  await db("model_items").insert(
    list.map((itemId) => ({
      model_id: createdModel.id,
      item_id: itemId,
    })),
  );

  return createdModel;
}

async function insertModel(data: Omit<TCreateModelSchema, "items">) {
  const [model] = await db<Model>("models").insert(data).returning("*");

  return model;
}

async function findModelByName(name: string) {
  const model = await db<Model>("models")
    .select("*")
    .where("name", name)
    .first();

  return model;
}

const model = {
  paginated: paginatedModels,
  getModelById,
  createModel,
  createSchema: createModelSchema,
};

export default model;

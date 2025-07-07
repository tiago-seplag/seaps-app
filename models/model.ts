import { db } from "@/infra/database";
import { NotFoundError } from "@/infra/errors";

import { z } from "zod";

export const createModelSchema = z.object({
  organization_id: z
    .string()
    .uuid("O ID da organização deve ser um UUID válido."),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("O e-mail deve ser válido."),
  phone: z.string().optional(),
  role: z.string().optional(),
});

type TCreateModelSchema = z.infer<typeof createModelSchema>;

export async function paginatedModels(page = 1, perPage = 10) {
  const persons = await db("models")
    .select("models.*")
    .orderBy("models.created_at", "asc")
    .paginate(page, perPage);

  return persons;
}

async function getModelById(id: string) {
  const person = await db("models")
    .select("models.*")
    .where("models.id", id)
    .first();

  if (!person) {
    throw new NotFoundError({
      message: "Pessoa não encontrada.",
      action: "Verifique o ID fornecido.",
    });
  }

  return person;
}

async function createModel(data: TCreateModelSchema) {
  const [person] = await db("persons").insert(data).returning("*");

  return person;
}

const person = {
  paginated: paginatedModels,
  getModelById,
  createModel,
  createSchema: createModelSchema,
};

export default person;

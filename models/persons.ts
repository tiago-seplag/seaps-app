import { db } from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";

import { z } from "zod";

export const createPersonSchema = z.object({
  organization_id: z
    .string()
    .uuid("O ID da organização deve ser um UUID válido."),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("O e-mail deve ser válido."),
  phone: z.string().optional(),
  role: z.string().optional(),
});

type TCreatePersonSchema = z.infer<typeof createPersonSchema>;

export async function paginatedPersons(
  page = 1,
  perPage = 10,
  search?: Record<string, string | null>,
) {
  const persons = await db("persons")
    .select("persons.*")
    .where((builder) => {
      if (search?.name) {
        builder.where("persons.name", "ilike", `%${search.name}%`);
      }
      if (search?.email) {
        builder.where("persons.email", "ilike", `%${search.email}%`);
      }
      if (search?.organization_id) {
        builder.where("persons.organization_id", search.organization_id);
      }
    })
    .orderBy("persons.name", "asc")
    .paginate(page, perPage);

  return persons;
}

async function getPersonById(id: string) {
  const person = await db("persons")
    .select("persons.*")
    .where("persons.id", id)
    .first();

  if (!person) {
    throw new NotFoundError({
      message: "Pessoa não encontrada.",
      action: "Verifique o ID fornecido.",
    });
  }

  return person;
}

async function createPerson(data: TCreatePersonSchema) {
  const existingPerson = await findPersonByEmail(
    data.email,
    data.organization_id,
  );

  if (existingPerson) {
    throw new ValidationError({
      message: "Já existe uma pessoa com este e-mail.",
      action: "Use um e-mail diferente.",
    });
  }

  const [person] = await db("persons").insert(data).returning("*");

  return person;
}

async function findPersonByEmail(email: string, organizationId: string) {
  const person = await db("persons")
    .select("persons.*")
    .where("persons.email", email)
    .andWhere("persons.organization_id", organizationId)
    .first();

  return person;
}

const person = {
  paginated: paginatedPersons,
  getPersonById,
  createPerson,
  createPersonSchema,
};

export default person;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/infra/database";
import { ForbiddenError, NotFoundError, ValidationError } from "@/infra/errors";
import { z } from "zod";
import checklistItem from "./checklist-item";

export const checklistSchema = z
  .object({
    model_id: z.string({ message: "O ID do modelo é obrigatório" }),
    organization_id: z.string({ message: "O ID da organização é obrigatório" }),
    property_id: z.string({ message: "O ID do imóvel é obrigatório" }),
    user_id: z.string({ message: "O ID do usuário é obrigatório" }),
    is_returned: z.boolean({
      message: "Informe se é um checklist de retorno",
    }),
    return: z.number().optional(),
  })
  .strict();

const schemas = {
  validate: z.object({
    observation: z.string().optional(),
  }),
  create: z.object({
    model_id: z.string({ message: "O ID do modelo é obrigatório" }),
    organization_id: z.string({ message: "O ID da organização é obrigatório" }),
    property_id: z.string({ message: "O ID do imóvel é obrigatório" }),
    user_id: z.string({ message: "O ID do usuário é obrigatório" }),
  }),
  update: z
    .object({
      user_id: z
        .string({ message: "O ID do usuário é obrigatório" })
        .uuid({ message: "O ID do usuário deve ser um UUID válido" }),
    })
    .strict(),
};

export type ChecklistSchema = z.infer<typeof checklistSchema>;

async function paginated(options: any) {
  const checklists = await db("checklists")
    .select("checklists.*")
    .select(
      "organizations.name as organization:name",
      "organizations.acronym as organization:acronym",
    )
    .select("users.name as user:name")
    .select(
      "properties.name as property:name",
      "properties.address as property:address",
      "properties.type as property:type",
    )
    .innerJoin(
      "organizations",
      "organizations.id",
      "checklists.organization_id",
    )
    .innerJoin("users", "users.id", "checklists.user_id")
    .innerJoin("properties", "properties.id", "checklists.property_id")
    .where((query) => {
      query.where("checklists.is_deleted", false);
      if (options?.status) {
        query.where("checklists.status", options.status as string);
      }
      if (options?.property_name) {
        query.where("properties.name", "ilike", `%${options.property_name}%`);
      }
      if (options?.organization) {
        query.where(
          "checklists.organization_id",
          options?.organization as string,
        );
      }
      if (options?.user_id) {
        query.where("checklists.user_id", options.user_id as string);
      }

      if (options.user.role === "EVALUATOR") {
        query.where("checklists.user_id", options.user.id);
      }
    })
    .orderBy("created_at", "desc")
    .paginate(options.page, options.per_page, {
      nest: true,
    });

  return checklists;
}

export async function getChecklistById(id: string) {
  const checklist = await db("checklists")
    .select("checklists.*")
    .select(
      "organizations.name as organization:name",
      "organizations.acronym as organization:acronym",
      "organizations.id as organization:id",
    )
    .select(
      "users.name as user:name",
      "users.id as user:id",
      "users.role as user:role",
    )
    .select(
      "properties.name as property:name",
      "properties.id as property:id",
      "properties.address as property:address",
      "properties.type as property:type",
      "properties.created_at as property:created_at",
      "properties.updated_at as property:updated_at",
      "properties.person_id as property:person_id",
      "properties.organization_id as property:organization_id",
    )
    .select(
      "persons.name as property:person:name",
      "persons.id as property:person:id",
      "persons.email as property:person:email",
      "persons.phone as property:person:phone",
      "persons.role as property:person:role",
      "persons.created_at as property:person:created_at",
      "persons.updated_at as property:person:updated_at",
    )
    .innerJoin("properties", "properties.id", "checklists.property_id")
    .leftJoin("persons", "persons.id", "properties.person_id")
    .leftJoin("organizations", "organizations.id", "checklists.organization_id")
    .innerJoin("users", "users.id", "checklists.user_id")
    .where("checklists.id", id)
    .first()
    .nest();

  if (!checklist) {
    throw new NotFoundError({
      message: "Esse ID de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  return checklist;
}

async function getChecklistItems(id: string) {
  const checklist = await db("checklists").select("id").where("id", id).first();

  if (!checklist) {
    throw new NotFoundError({
      message: "Esse ID de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  const checklistItems = await db("checklist_items")
    .select("checklist_items.*")
    .select("items.id as item:id", "items.name as item:name")
    .where("checklist_items.checklist_id", id)
    .innerJoin("items", "items.id", "checklist_items.item_id")
    .orderBy("items.name")
    .nest();

  return checklistItems;
}

export async function createChecklist(data: z.infer<typeof checklistSchema>) {
  const checklist = await insertChecklist(data);

  const items = await db("items")
    .select("items.*")
    .innerJoin("model_items", "items.id", "model_items.item_id")
    .where("model_items.model_id", data.model_id);

  await db("checklist_items").insert(
    items.map((item) => ({
      checklist_id: checklist.id,
      item_id: item.id,
    })),
  );

  return { ...checklist, items };

  async function insertChecklist(data: z.infer<typeof checklistSchema>) {
    const SID = await generateSID();

    const [createdChecklist] = await db("checklists")
      .insert({
        organization_id: data.organization_id,
        user_id: data.user_id,
        property_id: data.property_id,
        sid: SID,
        model_id: data.model_id,
        is_returned: data.is_returned,
        return: data.return,
      })
      .returning("*");

    return createdChecklist;
  }

  async function generateSID() {
    const lastChecklist = await db<{ sid: string }>("checklists")
      .select("sid")
      .orderBy("created_at", "desc")
      .first();

    const year = new Date().getFullYear().toString().slice(2);

    let sid = "0001/" + year;

    if (lastChecklist && lastChecklist.sid.slice(-2) === year) {
      const number = Number(lastChecklist.sid.slice(0, 4)) + 1;
      sid = number.toString().padStart(4, "0") + "/" + year;
    }

    return sid;
  }
}

export async function finishChecklist(
  id: string,
  user: { id: string; role: string },
) {
  const checklist = await findById(id);

  const checklistItems = await db("checklist_items")
    .select("*")
    .select("items.name as item:name")
    .select(
      db.raw(
        `(SELECT COUNT(*) FROM checklist_item_images WHERE checklist_item_images.checklist_item_id = checklist_items.id) as "_count:images"`,
      ),
    )
    .innerJoin("items", "items.id", "checklist_items.item_id")
    .where("checklist_id", id)
    .nest();

  if (checklist.status === "CLOSED") {
    throw new ValidationError({
      message: "Esse checklist já foi finalizado",
      action: "Verifique se o checklist já foi finalizado",
    });
  }

  if (user.id !== checklist.user_id && user.role !== "ADMIN") {
    throw new ForbiddenError({
      message: "Você não tem permissão para finalizar esse checklist",
      action: "Verifique se você é o avaliador desse checklist",
    });
  }

  let SUM_SCORE = 0;
  let COUNT_ITEMS = 0;

  for (const item of checklistItems) {
    if (typeof item.score !== "number") {
      throw new ValidationError({
        message: "Todos os itens devem ser pontuatos.",
        action: `O item '${item.item.name}' não foi pontuado`,
      });
    }

    const score = Math.abs(item.score);

    if (score > 0 && item?._count.images < 1) {
      throw new ValidationError({
        message: "Todos os itens devem conter ao menos uma imagem",
        action: "Insira ao menos uma imagem no item: " + item.item.name,
      });
    }

    if (score > 0) {
      COUNT_ITEMS += 1;
      SUM_SCORE += item.score;
    }
  }

  const finalScore = SUM_SCORE / COUNT_ITEMS;

  const classification = finalScore > 2.5 ? 2 : finalScore < 1.5 ? 0 : 1;

  const [finishedChecklist] = await db("checklists")
    .where("id", id)
    .update({
      classification,
      score: finalScore,
      status: "CLOSED",
      finished_at: new Date(),
    })
    .returning("*");

  return finishedChecklist;
}

export async function reOpenChecklist(id: string) {
  const checklist = await findById(id);

  if (checklist.status !== "CLOSED") {
    throw new ValidationError({
      message: "Esse checklist não pode ser reaberto",
      action: "Verifique se o checklist já foi finalizado",
    });
  }

  const updatedChecklist = await db("checklists")
    .update({
      status: "OPEN",
      finished_at: null,
      score: 0,
      classification: null,
    })
    .where("id", id)
    .returning("*");

  return updatedChecklist;
}

export async function findById(id: string) {
  const checklist = await db("checklists").select("*").where("id", id).first();

  if (!checklist) {
    throw new ValidationError({
      message: "Esse checklist não existe",
      action: "Verifique se o checklist informado está correto",
    });
  }

  return checklist;
}

export async function validate(id: string) {
  const checklist = await findById(id);

  if (checklist.status !== "CLOSED") {
    throw new ValidationError({
      message: "Esse checklist não pode ser validado",
      action: "Verifique se o checklist foi finalizado",
    });
  }

  const checklistItems = await checklistItem.findAll(id);

  let status = "APPROVED";

  for (const item of checklistItems) {
    if (item.is_valid === null) {
      throw new ValidationError({
        message: "Todos os itens devem ser validados.",
        action: `O item '${item.item.name}' não foi validado`,
      });
    }

    if (item.is_valid === false) {
      status = "REJECTED";
    }
  }

  const [validatedChecklist] = await db("checklists")
    .where("id", id)
    .update({ status })
    .returning("*");

  return validatedChecklist;
}

async function createLog(data: {
  action: string;
  checklist_id: string;
  checklist_item_id?: string;
  user_id: string;
  status?: string;
  observation?: string;
}) {
  await db("checklist_logs").insert({
    action: data.action,
    checklist_id: data.checklist_id,
    checklist_item_id: data.checklist_item_id,
    user_id: data.user_id,
    status: data.status,
    observation: data.observation,
  });
}

async function update(id: string, data: { user_id: string }) {
  await findById(id);

  const [updatedChecklist] = await db("checklists")
    .where("id", id)
    .update({ user_id: data.user_id })
    .returning("*");

  return updatedChecklist;
}

async function _delete(id: string) {
  await findById(id);

  const [data] = await db("checklists")
    .where("id", id)
    .update({ is_deleted: true })
    .returning("*");

  return data;
}

async function history(id: string) {
  const checklist = await findById(id);
  const history = await db("checklist_logs")
    .select("checklist_logs.*", "items.name as item:name")
    .select("users.name as user:name", "users.email as user:email")
    .leftJoin(
      "checklist_items",
      "checklist_items.id",
      "checklist_logs.checklist_item_id",
    )
    .leftJoin("items", "items.id", "checklist_items.item_id")
    .leftJoin("users", "users.id", "checklist_logs.user_id")
    .where("checklist_logs.checklist_id", checklist.id)
    .orderBy("checklist_logs.created_at", "desc")
    .nest();

  return history;
}

const checklist = {
  paginated,
  getChecklistById,
  createChecklist,
  finishChecklist,
  reOpenChecklist,
  findById,
  createLog,
  getChecklistItems,
  validate,
  delete: _delete,
  update,
  history,
  createSchema: checklistSchema,
  schemas: {
    validate: schemas.validate,
    update: schemas.update,
  },
};

export default checklist;

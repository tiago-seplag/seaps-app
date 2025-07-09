import { ValidationError } from "@/errors/validation-error";
import { db } from "@/infra/database";
import { prisma } from "@/lib/prisma";
import { SearchParams } from "@/types/types";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { z } from "zod";

export const checklistSchema = z.object({
  model_id: z.string({ message: "O ID do modelo é obrigatório" }),
  organization_id: z.string({ message: "O ID da organização é obrigatório" }),
  property_id: z.string({ message: "O ID do imóvel é obrigatório" }),
  user_id: z.string({ message: "O ID do usuário é obrigatório" }),
});

export type ChecklistSchema = z.infer<typeof checklistSchema>;

export async function getChecklistsPaginated(
  page = 1,
  perPage = 10,
  searchParams?: SearchParams,
) {
  const filter: SearchParams = {};

  if (searchParams?.status) {
    filter.status = searchParams.status;
  }

  if (searchParams?.property_name) {
    filter.property = {
      name: {
        contains: searchParams.property_name as string,
        mode: "insensitive",
      },
    };
  }

  if (searchParams?.organization) {
    filter.organization_id = searchParams.organization;
  }

  if (searchParams?.user) {
    filter.user_id = searchParams.user;
  }

  const total = await prisma.checklist.count({
    where: filter,
  });

  const meta = generateMetaPagination(page, perPage, total);

  const checklists = await prisma.checklist.findMany({
    include: {
      organization: {
        select: {
          name: true,
        },
      },
      property: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    where: filter,
    orderBy: {
      created_at: "desc",
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: checklists, meta };
}

export async function getChecklistById(id: string) {
  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: {
        include: {
          person: true,
          organization: true,
        },
      },
      organization: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!checklist) {
    throw new ValidationError({
      message: "Esse ID de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
      statusCode: 404,
    });
  }

  return checklist;
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
  const checklist = await findChecklistById(id);
  const checklistItems = await prisma.checklistItems.findMany({
    where: { checklist_id: id },
    include: {
      item: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          images: true,
        },
      },
    },
  });

  if (checklist.status === "CLOSED") {
    throw new ValidationError({
      message: "O checklist já foi finalizado",
      action: "",
      statusCode: 400,
    });
  }

  if (user.id !== checklist.user_id && user.role !== "ADMIN") {
    throw new ValidationError({
      message: "Apenas o responsável pode finalizar",
      action: "Pessa ao responsável para finalizar esse checklist",
      statusCode: 403,
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

    if (score > 0 && item._count.images < 1) {
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

  const finishedChecklist = await prisma.checklist.update({
    where: { id },
    data: {
      classification,
      score: finalScore,
      status: "CLOSED",
      finished_at: new Date(),
    },
  });

  return finishedChecklist;
}

export async function reOpenChecklist(id: string) {
  const checklist = await findChecklistById(id);

  if (checklist.status !== "CLOSED") {
    throw new ValidationError({
      message: "Esse checklist não pode ser reaberto",
      statusCode: 400,
      action: "Verifique se o checklist já foi finalizado",
    });
  }

  const updatedChecklist = await prisma.checklist.update({
    where: { id },
    data: {
      status: "OPEN",
      finished_at: null,
      score: 0,
      classification: null,
    },
  });

  return updatedChecklist;
}

export async function findChecklistById(id: string) {
  const checklist = await prisma.checklist.findUnique({
    where: { id },
  });

  if (!checklist) {
    throw new ValidationError({
      message: "Esse checklist não existe",
      statusCode: 404,
      action: "Verifique se o checklist informado está correto",
    });
  }

  return checklist;
}

async function createLog(data: {
  action: string;
  checklist_id: string;
  user_id: string;
}) {
  await db("checklist_logs").insert({
    action: data.action,
    checklist_id: data.checklist_id,
    user_id: data.user_id,
  });
}

const checklist = {
  getChecklistsPaginated,
  getChecklistById,
  createChecklist,
  finishChecklist,
  reOpenChecklist,
  findChecklistById,
  createLog,
  createSchema: checklistSchema,
};

export default checklist;

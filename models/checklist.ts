import { ValidationError } from "@/errors/validation-error";
import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { z } from "zod";

export const checklistSchema = z.object({
  model_id: z.string(),
  organization_id: z.string(),
  property_id: z.string(),
  user_id: z.string(),
});

export const updateChecklistItemSchema = z.object({
  score: z.number().optional(),
  observation: z.string().optional(),
});

export type ChecklistSchema = z.infer<typeof checklistSchema>;

export type UpdateChecklistItemSchema = z.infer<
  typeof updateChecklistItemSchema
>;

export async function getChecklistsPaginated(
  page = 1,
  perPage = 10,
  searchParams?: SearchParams,
) {
  const filter: SearchParams = {};

  if (searchParams?.status) {
    filter.status = searchParams.status;
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
      created_at: "asc",
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: checklists, meta };
}

export async function createChecklist(
  data: z.infer<typeof checklistSchema>,
  userId: string,
) {
  const values = data;

  const lastChecklist = await prisma.checklist.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  const year = new Date().getFullYear().toString().slice(2);

  let sid = "0001/" + year;

  if (lastChecklist && lastChecklist.sid.slice(-2) === year) {
    const number = Number(lastChecklist.sid.slice(0, 4)) + 1;
    sid = number.toString().padStart(4, "0") + "/" + year;
  }

  const checklist = await prisma.checklist.create({
    data: {
      organization_id: values.organization_id,
      created_by: userId,
      user_id: values.user_id,
      property_id: values.property_id,
      sid: sid,
      model_id: values.model_id,
    },
  });

  const items = await prisma.item.findMany({
    where: {
      modelItems: {
        some: {
          model_id: values.model_id,
        },
      },
    },
  });

  if (items.length > 0) {
    await prisma.checklistItems.createMany({
      data: items.map((item) => {
        return { item_id: item.id, checklist_id: checklist.id };
      }),
    });
  }

  return checklist;
}

export async function finishChecklist(id: string, userId: string) {
  const checklist = await prisma.checklist.findFirstOrThrow({
    where: { id },
    include: {
      checklistItems: {
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
      },
    },
  });

  if (userId !== checklist.user_id) {
    throw new ValidationError({
      message: "Apenas o responsável pode finalizar",
      action: "Pessa ao responsável para finalizar esse checklist",
      statusCode: 403,
    });
  }

  for (const item of checklist?.checklistItems) {
    if (item._count.images < 1) {
      throw new ValidationError({
        message: "Todos os itens devem conter ao menos uma imagem",
        action: "Insira ao menos uma imagem no item: " + item.item.name,
      });
    }
    if (typeof item.score !== "number") {
      throw new ValidationError({
        message: "Todos os itens devem ser pontuatos.",
        action: `O item '${item.item.name}' não foi pontuado`,
      });
    }
  }

  const finishedChecklist = await prisma.checklist.update({
    where: { id },
    data: {
      status: "CLOSED",
      finished_at: new Date(),
    },
  });

  return finishedChecklist;
}

export async function updateChecklistItem(
  id: string,
  userId: string,
  data: UpdateChecklistItemSchema,
) {
  const checklistItem = await prisma.checklistItems.findUnique({
    where: { id },
    include: {
      checklist: {
        select: {
          user_id: true,
        },
      },
    },
  });

  if (checklistItem?.checklist.user_id !== userId) {
    throw new ValidationError({
      message: "Apenas o responsável pode editar o item",
      action: "Pessa ao responsável para realizar o checklist",
      statusCode: 403,
    });
  }

  const updatedChecklistItem = await prisma.checklistItems.update({
    data: {
      score: data.score ? Number(data.score) : undefined,
      is_inspected: true,
      observation: data.observation ? data.observation : undefined,
    },
    where: { id },
  });

  return updatedChecklistItem;
}

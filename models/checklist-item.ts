/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from "@/errors/validation-error";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const updateChecklistItemSchema = z.object({
  score: z
    .string()
    .optional()
    .transform((value) => typeof value === "number" && isFinite(value)),
  observation: z.string().optional(),
  image: z.string().optional(),
});

export type UpdateChecklistItemSchema = z.infer<
  typeof updateChecklistItemSchema
>;

export async function getChecklistItemById(id: string) {
  const checklist = await prisma.checklistItems.findUnique({
    where: { id: id },
    include: {
      item: true,
      images: {
        orderBy: {
          created_at: "desc",
        },
      },
      checklist: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!checklist) {
    throw new ValidationError({
      message: "Esse ID de item não existe",
      action: "Verifique se o ID foi passado corretamente",
      statusCode: 404,
    });
  }

  return checklist;
}

export async function updateChecklistItem(
  id: string,
  data: UpdateChecklistItemSchema,
  user: {
    id: string;
    role: string;
  },
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

  if (
    checklistItem?.checklist.user_id !== user.id &&
    user.role === "EVALUATOR"
  ) {
    throw new ValidationError({
      message: "Apenas o responsável pode editar o item",
      action: "Pessa ao responsável para realizar o checklist",
      statusCode: 403,
    });
  }

  const updateData: any = {};

  if (data.observation) {
    updateData.observation = data.observation;
  }

  if (data.score) {
    updateData.score = Number(data.score);
  }

  if (data.image) {
    updateData.image = data.image;
  }

  const updatedChecklistItem = await prisma.checklistItems.update({
    data: updateData,
    where: { id },
  });

  return updatedChecklistItem;
}

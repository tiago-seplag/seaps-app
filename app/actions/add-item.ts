"use server";
import { prisma } from "@/lib/prisma";

export const addItem = async (values: {
  checklist_id: string;
  item_id: string;
}) => {
  const { checklist_id, item_id } = values;

  const checklistItem = await prisma.checklistItems.findFirst({
    where: {
      checklist_id,
      item_id,
    },
  });

  if (!checklistItem) {
    await prisma.checklistItems.create({
      data: {
        checklist_id,
        item_id,
      },
    });

    return true;
  }

  throw new Error(`item already created`);
};

"use server";
import { prisma } from "@/lib/prisma";

export const createItem = async (values: {
  name: string;
  checklist_id: string;
  property_id?: string;
  item_id?: string;
}) => {
  const { checklist_id, item_id, ...data } = values;

  const checklist = await prisma.checklist.findFirstOrThrow({
    where: {
      id: checklist_id,
    },
  });

  let level;

  if (item_id) {
    const item = await prisma.item.findFirstOrThrow({
      where: {
        id: item_id,
      },
    });

    level = item.level + 1;
  }

  const item = await prisma.item.create({
    data: { ...data, property_id: checklist?.property_id, level, item_id },
  });

  await prisma.checklistItems.create({
    data: {
      checklist_id,
      item_id: item.id,
    },
  });
};

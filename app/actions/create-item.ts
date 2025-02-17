"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const createItem = async (values: {
  name: string;
  checklist_id?: string;
  property_id?: string;
  item_id?: string;
  level?: number;
}) => {
  const { checklist_id, ...data } = values;

  if (checklist_id) {
    const checklist = await prisma.checklist.findFirstOrThrow({
      where: {
        id: checklist_id,
      },
    });

    const item = await prisma.item.create({
      data: { ...data, property_id: checklist?.property_id },
    });

    await prisma.checklistItems.create({
      data: {
        checklist_id,
        item_id: item.id,
      },
    });
    redirect("/checklists/" + checklist_id);
  }
};

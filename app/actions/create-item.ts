"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const createItem = async (values: {
  name: string;
  checklist_id?: string;
  property_id: string;
  item_id?: string;
  level?: number;
}) => {
  const { checklist_id, ...data } = values;

  const item = await prisma.item.create({
    data: { ...data },
  });

  if (checklist_id) {
    await prisma.checklistItems.create({
      data: {
        checklist_id,
        item_id: item.id,
      },
    });
  }

  redirect("/checklists/" + checklist_id);
};

"use server";
import { prisma } from "@/lib/prisma";

export const createChecklist = async (values: {
  organization_id: string;
  property_id: string;
}) => {
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
    data: { property_id: values.property_id, sid: sid },
  });

  const items = await prisma.item.findMany({
    where: {
      property_id: values.property_id,
    },
  });

  if (items.length > 0) {
    await prisma.checklistItems.createMany({
      data: items.map((item) => {
        return { item_id: item.id, checklist_id: checklist.id };
      }),
    });
  }

  return true;
};

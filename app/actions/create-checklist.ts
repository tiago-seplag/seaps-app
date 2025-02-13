"use server";
import { prisma } from "@/lib/prisma";

export const createChecklist = async (values: {
  organization_id: string;
  property_id: string;
}) => {
  const checklist = await prisma.checklist.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  const year = new Date().getFullYear().toString().slice(2);

  let sid = "0001/" + year;

  if (checklist && checklist.sid.slice(-2) === year) {
    const number = Number(checklist.sid.slice(0, 4)) + 1;
    sid = number.toString().padStart(4, "0") + "/" + year;
  }

  await prisma.checklist.create({
    data: { property_id: values.property_id, sid: sid },
  });

  return true;
};

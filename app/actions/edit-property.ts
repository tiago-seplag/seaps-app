"use server";
import { prisma } from "@/lib/prisma";

export const editProperty = async (
  values: {
    organization_id: string;
    person_id: string;
    name: string;
    type: string;
    address?: string | undefined;
  },
  id: string,
) => {
  await prisma.property.update({
    where: { id },
    data: values,
  });

  return true;
};

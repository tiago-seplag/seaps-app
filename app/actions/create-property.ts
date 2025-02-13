"use server";
import { prisma } from "@/lib/prisma";

export const createProperty = async (values: {
  name: string;
  organization_id: string;
  address?: string | undefined;
}) => {
  await prisma.property.create({
    data: values,
  });

  return true;
};

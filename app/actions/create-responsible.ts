"use server";
import { prisma } from "@/lib/prisma";

export const createResponsible = async (values: {
  name: string;
  organization_id: string;
  email?: string | undefined;
  phone?: string | undefined;
  role?: string | undefined;
}) => {
  await prisma.person.create({
    data: values,
  });

  return true;
};

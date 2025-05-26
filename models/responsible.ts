import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const responsibleSchema = z
  .object({
    name: z.string().min(1),
    organization_id: z.string().uuid(),
    email: z.string(),
    phone: z.string().optional(),
    role: z.string().optional(),
  })
  .strict();

export type ResponsibleSchema = z.infer<typeof responsibleSchema>;

export async function updateResponsible(data: ResponsibleSchema, id: string) {
  const person = await prisma.person.update({
    where: { id },
    data: data,
  });

  return Response.json(person);
}

export async function createResponsible(data: ResponsibleSchema) {
  const values = data;

  const responsible = await prisma.person.create({
    data: { ...values, email: values.email.toLowerCase() },
  });

  return responsible;
}

export async function getResponsibleByEmail(email: string, id?: string) {
  let notFilter = {};
  if (id) {
    notFilter = {
      NOT: {
        id,
      },
    };
  }

  const responsibleEmail = prisma.person.findFirst({
    where: {
      email,
      ...notFilter,
    },
  });

  return responsibleEmail;
}

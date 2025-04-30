import { ValidationError } from "@/errors/validation-error";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const responsibleSchema = z.object({
  name: z.string().min(1),
  organization_id: z.string().uuid(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export type ResponsibleSchema = z.infer<typeof responsibleSchema>;

export async function createResponsible(data: ResponsibleSchema) {
  const values = data;

  const verifyEmail = await getResponsibleByEmail(values.email);

  if (verifyEmail) {
    throw new ValidationError({
      message: "Email já em uso.",
      action: `Insira outro email.`,
    });
  }

  const responsible = await prisma.person.create({
    data: values,
  });

  return responsible;
}

async function getResponsibleByEmail(email: string) {
  const responsibleEmail = prisma.person.findFirst({
    where: {
      email,
    },
  });

  return responsibleEmail;
}

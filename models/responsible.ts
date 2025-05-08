import { ValidationError } from "@/errors/validation-error";
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
  const verifyEmail = await getResponsibleByEmail(data.email, id);

  if (verifyEmail) {
    throw new ValidationError({
      message: "Email já em uso.",
      action: `Insira outro email.`,
    });
  }

  const property = await prisma.person.update({
    where: { id },
    data: data,
  });

  return Response.json(property);
}

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

async function getResponsibleByEmail(email: string, id?: string) {
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

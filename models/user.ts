import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { z } from "zod";
import { ValidationError } from "@/errors/validation-error";

export const updateConfigSchema = z.object({
  is_active: z.boolean(),
  role: z.enum(["ADMIN", "SUPERVISOR", "EVALUATOR"]),
});

export async function generateTempPassword(userId: string) {
  const password = randomBytes(4).toString("hex");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    data: {
      password: hashPassword,
    },
    where: {
      id: userId,
    },
  });

  return password;
}

export async function getUsersPaginated(
  page = 1,
  perPage = 10,
  searchParams?: SearchParams,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  if (searchParams?.name) {
    filter.name = {
      contains: searchParams?.name,
    };
  }

  const total = await prisma.user.count({
    where: filter,
  });

  const meta = generateMetaPagination(page, perPage, total);

  const checklists = await prisma.user.findMany({
    where: filter,
    orderBy: {
      created_at: "asc",
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: checklists, meta };
}

export async function updateUserConfigs(
  userId: string,
  data: z.infer<typeof updateConfigSchema>,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.role === "ADMIN") {
    throw new ValidationError({
      message: "Você não pode alterar um usuário administrador.",
      action: `Entre em contato com o suporte.`,
    });
  }

  if (data.role === "ADMIN") {
    throw new ValidationError({
      message: "Você não pode promover um usuário a administrador.",
      action: `Entre em contato com o suporte.`,
    });
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      is_active: data.is_active,
      role: data.role,
    },
  });

  return {
    id: updateUser.id,
    name: updateUser.name,
    role: updateUser.role,
    is_active: updateUser.is_active,
    email: updateUser.email,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { z } from "zod";
import { db } from "@/infra/database";
import { SearchParams } from "@/types/types";
import { hash } from "./password";
import { ValidationError } from "@/infra/errors";

export const updateConfigSchema = z.object({
  is_active: z.boolean(),
  role: z.enum(["ADMIN", "SUPERVISOR", "EVALUATOR"]),
  permissions: z.array(z.string()).optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("O e-mail deve ser válido."),
  cpf: z.string(),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(100, "A senha deve ter no máximo 100 caracteres.")
    .optional(),
  role: z.enum(["ADMIN", "SUPERVISOR", "EVALUATOR"]),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export async function generateTempPassword(userId: string) {
  const password = randomBytes(4).toString("hex");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  await db("users").update({ password: hashPassword }).where("id", userId);

  return password;
}

export async function getUsersPaginated(
  page = 1,
  perPage = 10,
  searchParams?: SearchParams,
) {
  const filter: any = {};

  if (searchParams?.name) {
    filter.name = {
      contains: searchParams?.name.toString().toUpperCase(),
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

export async function updateConfigs(
  userId: string,
  data: z.infer<typeof updateConfigSchema>,
) {
  const [updateUser] = await db("users")
    .update({
      is_active: data.is_active,
      role: data.role,
      permissions: data.permissions,
    })
    .where("id", userId)
    .returning("*");

  return updateUser;
}

export async function getUserById(userId: string) {
  const user = prisma.user.findUnique({
    select: {
      id: true,
      role: true,
      name: true,
      is_active: true,
      is_deleted: true,
      email: true,
    },
    where: { id: userId },
  });

  if (!user) {
    throw new ValidationError({
      message: "Usuário não encontrado.",
      action: `Entre em contato com o suporte.`,
    });
  }

  return user;
}

export async function createUser(data: TCreateUserSchema) {
  await validateUniqueCPF(data.cpf, data.email);
  if (data.password) {
    await hashPasswordInObject(data);
  }

  const [user] = await db("users").insert(data).returning("*");

  return user;

  async function validateUniqueCPF(cpf: string, email: string) {
    const existingUser = await db("users")
      .where((query) => {
        query.where("cpf", cpf).andWhere("email", email);
      })
      .first();

    if (existingUser) {
      throw new ValidationError({
        message: "O CPF informado já está sendo utilizado.",
        action: "Contate algum administrador.",
      });
    }
  }
}

async function hashPasswordInObject(data: TCreateUserSchema) {
  const hashedPassword = await hash(data.password!);
  data.password = hashedPassword;
}

async function paginated(options: any) {
  const users = await db("users")
    .select("id", "name", "email", "role", "is_active", "created_at")
    .where((query) => {
      if (options?.name) {
        query.whereILike("name", `%${options?.name}%`);
      }
      if (options?.email) {
        query.whereILike("email", `%${options?.email}%`);
      }
      if (options?.role) {
        query.where("permissions", "@>", [options?.role]);
      }
    })
    .orderBy("name", "asc")
    .paginate(options.page, options.per_page);

  return users;
}

async function findById(id: string) {
  const user = await db("users")
    .select(
      "id",
      "name",
      "email",
      "role",
      "permissions",
      "is_active",
      "created_at",
      "updated_at",
    )
    .where("id", id)
    .first();

  return user;
}

async function findOrThrow(id: string) {
  const user = await findById(id);

  if (!user) {
    throw new ValidationError({
      message: "Usuário não encontrado.",
      action: `Entre em contato com o suporte.`,
    });
  }
  return user;
}

const user = {
  paginated,
  findById,
  findOrThrow,
  createUser,
  updateUser: updateConfigs,
  updateConfigs,
};

export default user;

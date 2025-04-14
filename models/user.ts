import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";

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

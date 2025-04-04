import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function generateTempPassword(userId: string) {
  const password = randomBytes(4).toString("hex");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.update({
    data: {
      password: hashPassword,
    },
    where: {
      id: userId,
    },
  });

  return user;
}

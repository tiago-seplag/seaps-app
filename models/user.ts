import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function generateTempPassword(password: string, userId: string) {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password!, salt);

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

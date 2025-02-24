/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function saveToken(data: string) {
  const cookieStore = await cookies();
  const decoded: any = jwt.decode(data);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = await prisma.user.upsert({
    create: {
      name: decoded.name,
      cpf: decoded.cpf,
      email: decoded.email,
    },
    update: {
      name: decoded.name,
      cpf: decoded.cpf,
      email: decoded.email,
    },
    where: {
      cpf: decoded.cpf,
    },
  });

  cookieStore.set("user", JSON.stringify(user));
  cookieStore.set("session", data);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("MT_ID_SESSION");
  cookieStore.delete("SESSION");
  cookieStore.delete("USER");
}

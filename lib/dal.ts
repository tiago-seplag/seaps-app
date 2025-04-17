import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("SESSION")?.value;
  const session = await decrypt(cookie);

  if (typeof session !== "string" && !session?.id) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      select: {
        avatar: true,
        email: true,
        id: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      where: {
        id: session.id,
      },
    });

    return user;
  } catch {
    return null;
  }
});

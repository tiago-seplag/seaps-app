import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import session from "@/models/session";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) {
    redirect("/login");
  }

  const storegedSession = await session.findUserAndToken(cookie);

  return storegedSession;
});

export const getUser = cache(async () => {
  const storegedSession = await verifySession();

  try {
    const user = storegedSession?.user;

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
});

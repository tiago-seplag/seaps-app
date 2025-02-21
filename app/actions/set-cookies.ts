/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function saveToken(data: string) {
  const cookieStore = await cookies();
  const decoded: any = jwt.decode(data);

  const user = {
    name: decoded.name,
    cpf: decoded.cpf,
    email: decoded.email,
    avatar: "",
  };

  cookieStore.set("user", JSON.stringify(user));
  cookieStore.set("session", data);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

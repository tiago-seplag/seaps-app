/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

async function verifyToken(token: string | null) {
  if (!token) return null;

  const decoded: any = jwt.decode(token);

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      role: true,
      is_active: true,
    },
    where: {
      cpf: decoded.cpf,
    },
  });

  if (user) {
    return user;
  }

  return null;
}

export async function authMiddleware(req: NextRequest) {
  const cookieStore = await cookies();

  const token = cookieStore.get("SESSION");

  if (!token) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await verifyToken(token.value);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  req.headers.set("x-user-id", String(user.id));

  return null;
}

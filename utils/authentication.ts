import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

async function verifyToken(token: string | null) {
  if (!token) return null;

  const decoded = jwt.decode(token) as { cpf: string };

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
  const token = req.cookies.get("SESSION")?.value;

  if (!token) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await verifyToken(token);

  if (!user || !user.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  req.headers.set("x-user-id", String(user.id));
  req.headers.set("x-user-role", String(user.role));

  return null;
}

import { prisma } from "@/lib/prisma";
import { withMiddlewares } from "@/utils/handler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function postHandler(request: NextRequest) {
  const values = await request.json();
  const cookieStore = await cookies();

  const userData = await prisma.user.findFirst({
    where: {
      email: values.email,
    },
    select: {
      name: true,
      id: true,
      email: true,
      cpf: true,
      avatar: true,
      role: true,
      is_active: true,
      is_deleted: true,
      created_at: true,
      updated_at: true,
      password: true,
    },
  });

  if (!userData || !userData.password)
    return NextResponse.json(
      {
        message: "Email ou Senha invalidos",
        action: "verifique se os dados informados estão corretos",
        statusCode: 401,
      },
      { status: 401 },
    );

  const verifiedPassword = await bcrypt.compare(
    values.password,
    userData.password!,
  );

  if (!verifiedPassword)
    return NextResponse.json(
      {
        message: "Email ou Senha invalidos",
        action: "verifique se os dados informados estão corretos",
        statusCode: 401,
      },
      { status: 401 },
    );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = userData;

  const signedToken = jwt.sign(
    {
      ...user,
      exp: (Date.now() + 60 * 60 * 24 * 7 * 1000) / 1000,
    },
    process.env.JWT_SECRET || "",
  );

  cookieStore.set("SESSION", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date().getTime() + 60 * 60 * 24 * 7 * 1000,
    sameSite: "strict",
    path: "/",
  });

  return Response.json({
    SESSION: signedToken,
    USER: user,
  });
}

export const POST = withMiddlewares([], postHandler);

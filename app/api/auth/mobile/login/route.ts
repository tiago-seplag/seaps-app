import { prisma } from "@/lib/prisma";
import { withMiddlewares } from "@/utils/handler";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

async function postHandler(request: NextRequest) {
  const values = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      email: values.email,
    },
    select: {
      name: true,
      cpf: true,
      password: true,
      email: true,
    },
  });

  if (!user)
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
    user.password!,
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

  const signedToken = jwt.sign(
    {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
    },
    process.env.JWT_SECRET || "",
  );

  return Response.json({
    SESSION: signedToken,
    USER: user,
  });
}

export const POST = withMiddlewares([], postHandler);

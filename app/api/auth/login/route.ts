/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { withMiddlewares } from "@/utils/handler";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { config } from "@/utils/mt-login";
import jwt from "jsonwebtoken";

async function postHandler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cookieStore = await cookies();
  const code = searchParams.get("code");
  const redirect_uri = searchParams.get("redirect_uri");
  const code_verifier = searchParams.get("code_verifier");

  const body: any = {
    grant_type: config.grant_type!,
    client_id: config.client_id!,
    code: code,
    redirect_uri: redirect_uri,
  };

  if (code_verifier && redirect_uri) {
    body.redirect_uri = redirect_uri;
    body.code_verifier = code_verifier;
  }

  if (code) {
    const data = await fetch(config.url_token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    }).then((data) => data.json());

    if (data.access_token) {
      const decoded: any = jwt.decode(data.access_token);

      const user = await prisma.user.upsert({
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
        },
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

      const signedToken = jwt.sign(
        {
          ...user,
          exp: new Date(decoded.exp * 1000).getTime() / 1000,
        },
        process.env.JWT_SECRET || "",
      );

      cookieStore.set("MT_ID_SESSION", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(decoded.exp * 1000),
        sameSite: "strict",
        path: "/",
      });
      cookieStore.set("SESSION", signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(decoded.exp * 1000),
        sameSite: "strict",
        path: "/",
      });

      return Response.json({
        MT_ID_SESSION: data.access_token,
        SESSION: signedToken,
        USER: user,
      });
    }
  }

  return Response.json({ error: `unknown error` }, { status: 500 });
}

export const POST = withMiddlewares([], postHandler);

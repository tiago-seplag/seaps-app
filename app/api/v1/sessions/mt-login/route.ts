/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { config } from "@/utils/mt-login";
import jwt from "jsonwebtoken";
import authentication from "@/models/authentication";
import user from "@/models/user";
import session, { EXPIRATION_IN_MILLISECONDS } from "@/models/session";
import { handler } from "@/infra/controller";

async function postHandler(request: NextRequest) {
  const cookie = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code")!;
  const redirect_uri = searchParams.get("redirect_uri");
  const code_verifier = searchParams.get("code_verifier");

  const body: Record<string, string> = {
    grant_type: config.grant_type!,
    client_id: config.client_id!,
    code: code,
    redirect_uri: config.redirect_uri,
  };

  if (code_verifier && redirect_uri) {
    body.redirect_uri = redirect_uri;
    body.code_verifier = code_verifier;
  }

  if (code) {
    const response = await fetch(config.url_token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data || "unknown error" }, { status: 500 });
    }

    if (data.access_token) {
      const decoded: any = jwt.decode(data.access_token);

      let findedUser = await authentication.findUserByCpf(decoded.cpf);

      if (!findedUser) {
        findedUser = await user.createUser({
          cpf: decoded.cpf,
          name: decoded.name,
          email: decoded.email,
          role: "EVALUATOR",
        });
      }

      const newSession = await session.create(findedUser.id, {
        userAgent: request.headers.get("user-agent"),
        type: "mt-login",
      });

      cookie.set("session", newSession.token, {
        path: "/",
        maxAge: EXPIRATION_IN_MILLISECONDS / 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });

      return Response.json(newSession, { status: 201 });
    }
  }

  return Response.json({ error: `unknown error` }, { status: 500 });
}

export const POST = handler([], postHandler);

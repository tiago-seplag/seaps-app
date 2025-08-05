import { handler } from "@/infra/controller";
import { getAuthenticationUserByEmail } from "@/models/authentication";
import session, { EXPIRATION_IN_MILLISECONDS } from "@/models/session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function postHandler(request: NextRequest) {
  const cookie = await cookies();
  const values = await request.json();

  const authenticatedUser = await getAuthenticationUserByEmail(
    values.email,
    values.password,
  );

  const newSession = await session.create(authenticatedUser.id, {
    userAgent: request.headers.get("user-agent"),
    type: "password",
  });

  cookie.set("session", newSession.token, {
    path: "/",
    maxAge: EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return Response.json(newSession, { status: 201 });
}

export const POST = handler([], postHandler);

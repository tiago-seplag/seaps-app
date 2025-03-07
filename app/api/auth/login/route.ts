/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { withMiddlewares } from "@/utils/handler";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { config } from "@/utils/mt-login";
// import { NextRequest } from "next/server";

async function postHandler(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const searchParams = request.nextUrl.searchParams;
  const cookieStore = await cookies();
  const code = searchParams.get("code");

  if (code) {
    const data = await fetch(config.url_token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: config.grant_type,
        client_id: config.client_id,
        code: code,
        redirect_uri: config.redirect_uri,
      }),
    })
      .then((data) => data.json())
      .catch((e) => console.log(e));

    if (data.access_token) {
      const decoded: any = jwt.decode(data.access_token);

      const { password, ...user } = await prisma.user.upsert({
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
        },
        process.env.JWT_SECRET || "",
        {
          expiresIn: decoded.exp,
        },
      );

      cookieStore.set("MT_ID_SESSION", data.access_token);
      cookieStore.set("SESSION", signedToken);
      cookieStore.set("USER_DATA", JSON.stringify(user));

      return Response.json({
        MT_ID_SESSION: data.access_token,
        SESSION: signedToken,
        USER: user,
      });
    }
  }

  return Response.json({ error: `unknown error` }, { status: 500 });

  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars

  //   cookieStore.set("user", JSON.stringify(user));
  //   cookieStore.set("session", data);

  //   return Response.json(user);
}

export const POST = withMiddlewares([], postHandler);

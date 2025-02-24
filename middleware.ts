/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const publicRoutes = [
  {
    path: "/login",
    whenAuthenticated: "redirect",
  },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(resquest: NextRequest) {
  const path = resquest.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  const authToken = resquest.cookies.get("MT_ID_SESSION");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = resquest.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute) {
    const redirectUrl = resquest.nextUrl.clone();

    redirectUrl.pathname = "/";

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const decoded: any = jwt.decode(authToken.value);

    if (decoded.exp * 1000 < Date.now()) {
      (await cookies())
        .delete("MT_ID_SESSION")
        .delete("SESSION")
        .delete("USER");
      const redirectUrl = resquest.nextUrl.clone();

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

      return NextResponse.redirect(redirectUrl);
    }

    NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|.*\\.ico|_next/static|_next/image|.*\\.png$).*)"],
};

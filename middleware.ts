/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const publicRoutes = [
  {
    path: "/login",
    whenAuthenticated: "redirect",
  },
  {
    path: "/privacy-policy",
    whenAuthenticated: "ignore",
  },
  {
    path: "/manifest.webmanifest",
    whenAuthenticated: "ignore",
  },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  const sessionToken = request.cookies.get("SESSION");

  if (!sessionToken && publicRoute) {
    return NextResponse.next();
  }

  if (!sessionToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (sessionToken && publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    if (publicRoute.whenAuthenticated === "ignore") {
      return NextResponse.next();
    }

    redirectUrl.pathname = "/";

    return NextResponse.redirect(redirectUrl);
  }

  if (sessionToken && !publicRoute) {
    const decoded: any = jwt.decode(sessionToken.value);

    if (decoded.exp * 1000 < Date.now()) {
      (await cookies())
        .delete("MT_ID_SESSION")
        .delete("SESSION")
        .delete("USER");
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|.*\\.ico|_next/static|_next/image|.*\\.png$).*)"],
};

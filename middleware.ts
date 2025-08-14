import { NextResponse, NextRequest } from "next/server";

const publicRoutes = [
  {
    path: "/login",
    whenAuthenticated: "redirect",
  },
  {
    path: "/privacy-policy",
    whenAuthenticated: "ignore",
  },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  const sessionToken = request.cookies.get("session");

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
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|.*\\.ico|manifest.webmanifest|_next/static|_next/image|.*\\.png$).*)",
  ],
};

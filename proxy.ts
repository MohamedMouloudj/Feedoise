import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_ROUTES, APP_ROUTS } from "./config/config";
import { getCookieCache } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getCookieCache(request);

  const isPublicRoute =
    APP_ROUTS.PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/organizations/") ||
    pathname.startsWith("/projects/");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isApiRoute = new RegExp(`^(${API_ROUTES.AUTH_PREFIX})`).test(pathname); // it may extend

  if (isApiRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = APP_ROUTS.AUTH_ROUTES.includes(pathname);

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)",
  ],
};

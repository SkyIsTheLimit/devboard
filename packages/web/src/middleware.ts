import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin");

  // If not authenticated and not on auth page, redirect to signin
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If authenticated and on auth page, redirect to home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

/**
 * Matcher configuration for middleware
 * Excludes:
 * - /api/auth/* - NextAuth.js API routes
 * - /_next/static/* - Static files
 * - /_next/image/* - Image optimization files
 * - /favicon.ico - Favicon
 */
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

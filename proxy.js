import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("auth_token");


  const publicPaths = ["/auth/signin", "/auth/signup", "/"];


  if (!token && !publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

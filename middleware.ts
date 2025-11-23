import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const protectedRoutes = ["/Rumpi/Dashboard"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/Auth/Login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Rumpi/Dashboard/:path*"],
};

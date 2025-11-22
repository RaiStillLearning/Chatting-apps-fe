// src/lib/auth/cookies.ts
import type { NextRequest, NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "accessToken";

export function setAuthCookieOnResponse(res: NextResponse, token: string) {
  res.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 hari
  });
}

export function removeAuthCookieOnResponse(res: NextResponse) {
  res.cookies.delete(ACCESS_TOKEN_COOKIE);
}

// dipakai di middleware atau route handler untuk BACA cookie dari request
export function getAuthCookieFromRequest(req: NextRequest) {
  return req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
}

// src/lib/auth/cookies.ts
import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "accessToken";

export function setAuthCookie(token: string) {
  cookies().set(ACCESS_TOKEN_KEY, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 hari
  });
}

export function removeAuthCookie() {
  cookies().delete(ACCESS_TOKEN_KEY);
}

export function getAuthCookie() {
  return cookies().get(ACCESS_TOKEN_KEY)?.value;
}

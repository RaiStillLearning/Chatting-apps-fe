// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { removeAuthCookieOnResponse } from "@/lib/auth/cookies";

export async function POST() {
  const res = NextResponse.json({ message: "Logout success" });

  removeAuthCookieOnResponse(res);

  return res;
}

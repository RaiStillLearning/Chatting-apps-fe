// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // TODO: validasi user ke database, hashing password, dll
  const isValidUser = email === "test@rumpi.app" && password === "123456";

  if (!isValidUser) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // TODO: generate JWT sungguhan
  const fakeToken = "FAKE_JWT_TOKEN";

  // set cookie auth
  setAuthCookie(fakeToken);

  return NextResponse.json({ message: "Login success" });
}

// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookieOnResponse } from "@/lib/auth/cookies";
import { signAuthToken } from "@/lib/auth/jwt";

const demoUsers = [
  { id: "user1", email: "demo@rumpi.app", password: "rumpi123" },
  { id: "user2", email: "user1@rumpi.app", password: "rumpi123" },
  { id: "user3", email: "user2@rumpi.app", password: "rumpi123" },
];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = demoUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signAuthToken({ userId: user.id, email });

  // bikin response dulu
  const res = NextResponse.json({
    message: "Login success",
    user: { id: user.id, email: user.email },
  });

  // tempel cookie ke response
  setAuthCookieOnResponse(res, token);

  return res;
}

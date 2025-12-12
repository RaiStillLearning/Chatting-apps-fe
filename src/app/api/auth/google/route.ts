import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  // path setelah login berhasil
  const redirect =
    req.nextUrl.searchParams.get("redirect") || "/Rumpi/Dashboard";

  // arahkan user ke backend
  const url = `${API_URL}/api/auth/google?redirect=${redirect}`;

  return NextResponse.redirect(url);
}

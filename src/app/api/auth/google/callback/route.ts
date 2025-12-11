import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const redirect =
    req.nextUrl.searchParams.get("redirect") || "/Rumpi/Dashboard";

  // Redirect proxy ke callback backend
  return NextResponse.redirect(
    `${API_URL}/api/auth/google/callback?redirect=${redirect}`,
    { status: 307 }
  );
}

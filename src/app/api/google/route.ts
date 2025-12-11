import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const redirect = req.nextUrl.search || "";

  // Redirect langsung ke backend Google auth endpoint
  return NextResponse.redirect(`${API_URL}/api/auth/google${redirect}`, {
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
    
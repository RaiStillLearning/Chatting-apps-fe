import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  const redirect =
    req.nextUrl.searchParams.get("redirect") || "/Rumpi/Dashboard";

  const backendUrl = `${API_URL}/api/auth/google/callback?${req.nextUrl.search}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
    },
  });

  // forward cookies
  const res = NextResponse.redirect(redirect, 307);

  const setCookies =
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=)/g) || [];

  for (const cookie of setCookies) {
    res.headers.append("Set-Cookie", cookie);
  }

  return res;
}

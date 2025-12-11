import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  const redirect =
    req.nextUrl.searchParams.get("redirect") || "/Rumpi/Dashboard";

  // CALLBACK → BACKEND
  const backendUrl = `${API_URL}/api/auth/google/callback?redirect=${redirect}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: req.headers.get("cookie") || "",
    },
  });

  const res = new NextResponse(null, { status: 307 });
  res.headers.set("Location", redirect);

  // Copy ALL cookies BACK to browser
  const cookies =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookies.forEach((cookie) => {
    res.headers.append("Set-Cookie", cookie);
  });

  return res;
}

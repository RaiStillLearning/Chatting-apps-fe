import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Route khusus /api/auth/me (tanpa params/path)
export async function GET(req: NextRequest) {
  const backend = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
    },
  });

  const raw = await backend.text();

  const res = new NextResponse(raw, {
    status: backend.status,
    headers: {
      "Content-Type": backend.headers.get("content-type") ?? "application/json",
    },
  });

  // forward cookie dari backend
  const cookies =
    backend.headers.getSetCookie?.() ||
    backend.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookies.forEach((cookie) => res.headers.append("Set-Cookie", cookie));

  return res;
}

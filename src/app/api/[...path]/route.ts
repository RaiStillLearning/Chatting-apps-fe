import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// HYBRID PARAM TYPE (agar validator Next.js tidak error)
type Params = { params: { path: string[] } | Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Params) {
  return handler(req, ctx);
}
export async function POST(req: NextRequest, ctx: Params) {
  return handler(req, ctx);
}
export async function PUT(req: NextRequest, ctx: Params) {
  return handler(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: Params) {
  return handler(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: Params) {
  return handler(req, ctx);
}

async function handler(req: NextRequest, ctx: Params) {
  // NORMALISASI RUNTIME
  const params = await ctx.params;
  const path = params.path.join("/");

  const target = `${API_URL}/${path}${req.nextUrl.search}`;

  console.log("➡️ PROXY FETCH:", target);

  // PROXY MUST FORWARD COOKIE FROM NEXT SERVER STORAGE
  const backendRes = await fetch(target, {
    method: req.method,
    credentials: "include",
    headers: {
      "Content-Type": req.headers.get("content-type") || "",
      // 🔥 FIX PALING PENTING
      Cookie: req.headers.get("cookie") || "",
    },
    body: ["GET", "DELETE"].includes(req.method) ? undefined : await req.text(),
  });

  // Read backend result
  const body = await backendRes.text();

  const res = new NextResponse(body, {
    status: backendRes.status,
    headers: {
      "Content-Type":
        backendRes.headers.get("content-type") || "application/json",
    },
  });

  // 🔥 FORWARD **ALL** COOKIES DARI BACKEND → BROWSER
  const cookies =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/g) ||
    [];

  cookies.forEach((cookie) => res.headers.append("Set-Cookie", cookie));

  return res;
}

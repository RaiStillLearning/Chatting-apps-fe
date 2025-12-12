import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
  const params = await ctx.params;
  const path = params.path.join("/");

  const target = `${API_URL}/${path}${req.nextUrl.search}`;

  console.log("➡️ PROXY FETCH:", target);

  const cookieString = req.cookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const backendRes = await fetch(target, {
    method: req.method,
    credentials: "include",
    headers: {
      "Content-Type": req.headers.get("content-type") || "",
      Cookie: cookieString, // 🔥 FIX PALING KRITIS
    },
    body: ["GET", "DELETE"].includes(req.method) ? undefined : await req.text(),
  });

  const text = await backendRes.text();

  const res = new NextResponse(text, {
    status: backendRes.status,
    headers: {
      "Content-Type":
        backendRes.headers.get("content-type") || "application/json",
    },
  });

  const cookies =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/g) ||
    [];

  cookies.forEach((cookie) => res.headers.append("Set-Cookie", cookie));

  return res;
}

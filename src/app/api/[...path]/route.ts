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
  const params = ctx.params instanceof Promise ? await ctx.params : ctx.params;

  const target = `${API_URL}/${params.path.join("/")}${req.nextUrl.search}`;

  const contentType = req.headers.get("content-type") ?? "";
  let body: string | FormData | undefined;

  if (!["GET", "DELETE"].includes(req.method)) {
    if (contentType.includes("application/json")) body = await req.text();
    else if (contentType.includes("form-data")) body = await req.formData();
    else body = await req.text();
  }

  // REQUEST KE BACKEND
  const backend = await fetch(target, {
    method: req.method,
    body,
    credentials: "include",
    headers: {
      "Content-Type": contentType,
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

  // 🔥 FIX PALING PENTING
  const cookies =
    backend.headers.getSetCookie?.() ??
    backend.headers.get("set-cookie")?.split(/,(?=[^;]+=)/g) ??
    [];

  for (const cookie of cookies) {
    res.headers.append("Set-Cookie", cookie);
  }

  return res;
}

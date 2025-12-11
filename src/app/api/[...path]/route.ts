import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// ⚠️ Next.js 16 validator expects PROMISE params
// ⚠️ Runtime gives SYNC params
//
// Jadi kita buat tipe hybrid agar validator TIDAK error
type Context = {
  params: { path: string[] } | Promise<{ path: string[] }>;
};

export async function GET(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}
export async function POST(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}
export async function PUT(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}

// -----------------------------------------------------------
// MAIN HANDLER (NO ANY, COOKIE-FORWARD WORKING)
// -----------------------------------------------------------
async function handler(req: NextRequest, ctx: Context) {
  // ⬅️ FIX PALING PENTING
  // Validator expects Promise, runtime gives object → kita normalize
  const params = ctx.params instanceof Promise ? await ctx.params : ctx.params;

  const path = params.path;
  const url = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;

  console.log("🔁 PROXY ->", req.method, url);

  const contentType = req.headers.get("content-type") ?? "";
  let body: string | FormData | undefined = undefined;

  if (!["GET", "DELETE"].includes(req.method)) {
    if (contentType.includes("application/json")) body = await req.text();
    else if (contentType.includes("form-data")) body = await req.formData();
    else body = await req.text();
  }

  const backend = await fetch(url, {
    method: req.method,
    credentials: "include",
    headers: {
      "Content-Type": contentType,
      Cookie: req.headers.get("cookie") || "",
    },
    body,
  });

  const raw = await backend.text();
  const next = new NextResponse(raw, {
    status: backend.status,
    headers: {
      "Content-Type": backend.headers.get("content-type") || "text/plain",
    },
  });

  // Forward ALL cookies
  const cookies =
    backend.headers.getSetCookie?.() ||
    backend.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookies.forEach((c) => next.headers.append("Set-Cookie", c));

  return next;
}

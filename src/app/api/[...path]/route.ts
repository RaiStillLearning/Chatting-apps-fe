import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// Next.js v16 dynamic API route → params MUST be Promise
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

// -----------------------------------------------------------
// ⭐ PROXY FUNCTION (TANPA ANY)
// -----------------------------------------------------------
async function proxy(req: NextRequest, path: string[]) {
  const method = req.method;
  const backendURL = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;

  console.log(`🔁 PROXY → ${method} ${backendURL}`);

  const contentType = req.headers.get("content-type") ?? "";

  // -----------------------
  // ⭐ FIX: No-any body type
  // -----------------------
  let body: string | FormData | undefined = undefined;

  if (!["GET", "DELETE"].includes(method)) {
    if (contentType.includes("application/json")) {
      body = await req.text(); // JSON string persis
    } else if (contentType.includes("form-data")) {
      body = await req.formData();
    } else {
      body = await req.text();
    }
  }

  // -----------------------
  // SEND REQUEST KE BACKEND
  // -----------------------
  const backendRes = await fetch(backendURL, {
    method,
    credentials: "include",
    body,
    headers: {
      "Content-Type": contentType,
      Cookie: req.headers.get("cookie") ?? "",
    },
  });

  const raw = await backendRes.text();
  const type = backendRes.headers.get("content-type") ?? "text/plain";

  const nextRes = new NextResponse(raw, {
    status: backendRes.status,
    headers: {
      "Content-Type": type,
    },
  });

  // -----------------------------------
  // ⭐ FIX PALING PENTING — SET-COOKIE
  // -----------------------------------
  const cookies =
    backendRes.headers.getSetCookie?.() ??
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ??
    [];

  for (const cookie of cookies) {
    nextRes.headers.append("Set-Cookie", cookie);
  }

  return nextRes;
}

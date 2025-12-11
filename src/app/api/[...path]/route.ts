import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// *** FINAL VALID SIGNATURE FOR NEXT 16 ***
interface RouteParams {
  path: string[];
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  return proxy(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  return proxy(req, path, "POST");
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  return proxy(req, path, "PUT");
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  return proxy(req, path, "DELETE");
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  return proxy(req, path, "PATCH");
}

// --------------------------
// PROXY FUNCTION
// --------------------------
async function proxy(
  request: NextRequest,
  pathParts: string[],
  method: string
) {
  const fullPath = pathParts.join("/");
  const backendURL = `${API_URL}/${fullPath}${request.nextUrl.search}`;

  console.log(`🔁 PROXY -> ${method} ${backendURL}`);

  let body: BodyInit | undefined;
  const contentType = request.headers.get("content-type") || "";

  if (!["GET", "DELETE"].includes(method)) {
    if (contentType.includes("application/json")) {
      body = await request.text();
    } else if (contentType.includes("form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  }

  const backend = await fetch(backendURL, {
    method,
    credentials: "include",
    body,
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
  });

  const text = await backend.text();
  const type = backend.headers.get("content-type") || "text/plain";

  const res = new NextResponse(text, {
    status: backend.status,
    headers: { "Content-Type": type },
  });

  // Forward ALL cookies
  const cookies =
    backend.headers.getSetCookie?.() ||
    backend.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ||
    [];

  cookies.forEach((ck) => res.headers.append("Set-Cookie", ck));

  return res;
}

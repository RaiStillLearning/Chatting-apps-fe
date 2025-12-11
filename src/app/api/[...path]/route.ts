import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// 🔥 FIX: type resmi Next.js 16
type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params, "GET");
}
export async function POST(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params, "POST");
}
export async function PUT(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params, "PUT");
}
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params, "DELETE");
}
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params, "PATCH");
}

async function proxy(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const fullPath = (params.path || []).join("/");
  const backendURL = `${API_URL}/${fullPath}${request.nextUrl.search}`;

  console.log(`🔁 PROXY → ${method} ${backendURL}`);

  // ---- Body handling ----
  let body: BodyInit | null = null;
  if (!["GET", "DELETE"].includes(method)) {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await request.text();
    } else if (ct.includes("form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  }

  // ---- Forward to backend ----
  const backendRes = await fetch(backendURL, {
    method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "",
      Cookie: request.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });

  const responseText = await backendRes.text();
  const contentType = backendRes.headers.get("content-type") || "text/plain";

  const response = new NextResponse(responseText, {
    status: backendRes.status,
    headers: { "Content-Type": contentType },
  });

  // ---- Forward cookies ----
  const cookieHeaders =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookieHeaders.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// ******************************
// Next.js 16 Route Params Format
// ******************************
export interface RouteContext {
  params: {
    path: string[];
  };
}

export function GET(req: NextRequest, ctx: RouteContext) {
  return proxy(req, ctx, "GET");
}

export function POST(req: NextRequest, ctx: RouteContext) {
  return proxy(req, ctx, "POST");
}

export function PUT(req: NextRequest, ctx: RouteContext) {
  return proxy(req, ctx, "PUT");
}

export function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxy(req, ctx, "DELETE");
}

export function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxy(req, ctx, "PATCH");
}

// ******************************
// PROXY FUNCTION
// ******************************
async function proxy(request: NextRequest, ctx: RouteContext, method: string) {
  const segments = ctx?.params?.path || [];
  const endpoint = segments.join("/");

  const backendUrl = `${API_URL}/${endpoint}${request.nextUrl.search}`;

  console.log(`🔁 Proxy → ${method} ${backendUrl}`);

  // Handle body
  let body: BodyInit | undefined = undefined;
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

  // Forward to backend
  const backendRes = await fetch(backendUrl, {
    method,
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });

  // Handle response
  const resType = backendRes.headers.get("content-type") || "text/plain";
  const raw = await backendRes.text();

  const response = new NextResponse(raw, {
    status: backendRes.status,
    headers: { "Content-Type": resType },
  });

  // Forward cookies
  const cookies =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookies.forEach((c) => response.headers.append("Set-Cookie", c));

  return response;
}

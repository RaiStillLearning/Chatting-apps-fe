import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// Next.js 16 expects:
// params: Promise<{ path: string[] }>
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxy(req, params.path, "GET");
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxy(req, params.path, "POST");
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxy(req, params.path, "PUT");
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxy(req, params.path, "DELETE");
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxy(req, params.path, "PATCH");
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

  console.log(`🔁 PROXY → ${method} ${backendURL}`);

  // BODY HANDLING
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

  const backendRes = await fetch(backendURL, {
    method,
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
    credentials: "include",
    body,
  });

  const responseText = await backendRes.text();
  const resType = backendRes.headers.get("content-type") || "text/plain";

  const response = new NextResponse(responseText, {
    status: backendRes.status,
    headers: {
      "Content-Type": resType,
    },
  });

  const cookieHeaders =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookieHeaders.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
}

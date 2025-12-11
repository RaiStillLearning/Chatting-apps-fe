import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// ✔ Next.js 16 VALID signature — TANPA type alias!
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path, "PATCH");
}

// ---------------------------------
// REAL PROXY FUNCTION
// ---------------------------------
async function proxy(request: NextRequest, pathList: string[], method: string) {
  const fullPath = pathList.join("/");
  const target = `${API_URL}/${fullPath}${request.nextUrl.search}`;

  console.log(`🔁 PROXY → ${method} ${target}`);

  const contentType = request.headers.get("content-type") || "";
  let body: BodyInit | undefined = undefined;

  if (!["GET", "DELETE"].includes(method)) {
    if (contentType.includes("application/json")) {
      body = await request.text();
    } else if (contentType.includes("form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  }

  const backend = await fetch(target, {
    method,
    body,
    credentials: "include",
    headers: {
      Cookie: request.headers.get("cookie") || "",
      "Content-Type": contentType,
    },
  });

  const text = await backend.text();
  const responseType = backend.headers.get("content-type") || "text/plain";

  const response = new NextResponse(text, {
    status: backend.status,
    headers: { "Content-Type": responseType },
  });

  // ⭐ FORWARD COOKIES
  const cookies =
    backend.headers.getSetCookie?.() ||
    backend.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ||
    [];

  cookies.forEach((c) => response.headers.append("Set-Cookie", c));

  return response;
}

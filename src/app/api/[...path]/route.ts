// app/api/[...path]/route.ts
// Proxy semua request ke backend Railway
// Compatible with Next.js 15+

import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path, "GET");
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path, "POST");
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path, "PUT");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path, "DELETE");
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path, "PATCH");
}

async function proxyRequest(
  request: NextRequest,
  pathParts: string[],
  method: string
) {
  const path = pathParts.join("/");
  const url = `${NEXT_PUBLIC_API_URL}/${path}${request.nextUrl.search}`;

  console.log(`🔄 Proxying ${method} ${url}`);

  try {
    // Get body if exists
    let body = undefined;
    if (method !== "GET" && method !== "DELETE") {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          body = JSON.stringify(await request.json());
        } catch {
          // Body might be empty
          body = undefined;
        }
      } else if (contentType?.includes("multipart/form-data")) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Forward request to backend
    const backendRes = await fetch(url, {
      method,
      headers: {
        "Content-Type":
          request.headers.get("content-type") || "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: body instanceof FormData ? body : body,
      credentials: "include",
    });

    // Get response data
    const contentType = backendRes.headers.get("content-type");
    let data: string | ArrayBuffer;

    if (contentType?.includes("application/json")) {
      data = await backendRes.text();
    } else {
      data = await backendRes.arrayBuffer();
    }

    // Create response
    const response = new NextResponse(data, {
      status: backendRes.status,
      headers: {
        "Content-Type": contentType || "application/json",
      },
    });

    // Forward Set-Cookie headers from backend
    const setCookieHeaders = backendRes.headers.getSetCookie?.() || [];

    if (setCookieHeaders.length > 0) {
      // Process each cookie
      setCookieHeaders.forEach((cookie) => {
        // Keep the cookie as-is since we're same-origin now
        response.headers.append("Set-Cookie", cookie);
      });
    } else {
      // Fallback for older fetch implementations
      const setCookie = backendRes.headers.get("set-cookie");
      if (setCookie) {
        response.headers.set("Set-Cookie", setCookie);
      }
    }

    return response;
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

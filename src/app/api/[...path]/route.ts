// app/api/[...path]/route.ts
// Proxy semua request ke backend Railway

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://chatting-apps-be.up.railway.app";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "DELETE");
}

async function proxyRequest(
  request: NextRequest,
  pathParts: string[],
  method: string
) {
  const path = pathParts.join("/");
  const url = `${BACKEND_URL}/${path}`;

  console.log(`🔄 Proxying ${method} ${url}`);

  try {
    // Get body if exists
    let body = undefined;
    if (method !== "GET" && method !== "DELETE") {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        body = JSON.stringify(await request.json());
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
        // Forward cookies from browser
        Cookie: request.headers.get("cookie") || "",
      },
      body,
      credentials: "include",
    });

    // Get response data
    const data = await backendRes.text();

    // Create response
    const response = new NextResponse(data, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/json",
      },
    });

    // Forward Set-Cookie headers from backend to browser
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      // Remove sameSite=none and secure from backend cookie
      // because same-origin doesn't need them
      const cleanCookie = setCookie
        .replace(/; SameSite=None/gi, "")
        .replace(/; Secure/gi, "");

      response.headers.set("Set-Cookie", cleanCookie);
    }

    return response;
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

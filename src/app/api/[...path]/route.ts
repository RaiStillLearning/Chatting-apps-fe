import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// Type resmi Next.js 16 untuk route dynamic [...path]
interface RouteContext {
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

async function proxy(request: NextRequest, ctx: RouteContext, method: string) {
  const pathList = ctx.params?.path || [];
  const fullPath = pathList.join("/");

  const backendURL = `${API_URL}/${fullPath}${request.nextUrl.search}`;

  console.log(`🔁 PROXY → ${method} ${backendURL}`);

  // --------------------------
  // Body handling
  // --------------------------
  let body: BodyInit | undefined = undefined;

  if (!["GET", "DELETE"].includes(method)) {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await request.text(); // exact JSON string (tidak dirusak)
    } else if (contentType.includes("form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  }

  // --------------------------
  // Forward request to backend
  // --------------------------
  const backendResponse = await fetch(backendURL, {
    method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "",
      Cookie: request.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });

  // --------------------------
  // Output response
  // --------------------------
  const contentType = backendResponse.headers.get("content-type") || "";
  const raw = await backendResponse.text();

  const response = new NextResponse(raw, {
    status: backendResponse.status,
    headers: { "Content-Type": contentType },
  });

  // --------------------------
  // Forward ALL Set-Cookie headers from backend → browser
  // --------------------------
  const cookieHeaders =
    backendResponse.headers.getSetCookie?.() ||
    backendResponse.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+)/) ||
    [];

  cookieHeaders.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
}

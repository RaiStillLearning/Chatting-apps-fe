import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://chatting-apps-be.up.railway.app";

// ✔ FIX: params harus Promise<{ path: string[] }>
type Context = {
  params: Promise<{ path: string[] }>;
};

async function handler(request: NextRequest, context: Context) {
  // ✔ FIX: menunggu Promise params
  const { path } = await context.params;

  const fullPath = path.join("/");
  const target = `${API_URL}/${fullPath}${request.nextUrl.search}`;

  console.log(`🔁 PROXY → ${request.method} ${target}`);

  // BODY HANDLING
  const contentType = request.headers.get("content-type") || "";
  let body: BodyInit | undefined = undefined;

  if (!["GET", "DELETE"].includes(request.method)) {
    if (contentType.includes("application/json")) {
      body = await request.text();
    } else if (contentType.includes("form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }
  }

  // PROXY REQUEST -> Backend
  const backendRes = await fetch(target, {
    method: request.method,
    credentials: "include",
    body,
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
  });

  const raw = await backendRes.text();
  const type = backendRes.headers.get("content-type") || "text/plain";

  const res = new NextResponse(raw, {
    status: backendRes.status,
    headers: { "Content-Type": type },
  });

  const setCookies =
    backendRes.headers.getSetCookie?.() ||
    backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ||
    [];

  setCookies.forEach((cookie) => res.headers.append("Set-Cookie", cookie));

  return res;
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};

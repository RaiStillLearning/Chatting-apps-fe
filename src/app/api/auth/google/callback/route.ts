import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// HANDLE GOOGLE CALLBACK
export async function GET(req: NextRequest) {
  try {
    const redirectPath =
      req.nextUrl.searchParams.get("redirect") || "/Rumpi/Dashboard";

    const search = req.nextUrl.search; // sudah termasuk ?code=xxx&state=...
    const backendUrl = `${API_URL}/api/auth/google/callback${search}`;

    console.log("➡️ FORWARD CALLBACK KE BACKEND:", backendUrl);

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
      },
    });

    const setCookies =
      backendRes.headers.getSetCookie?.() ||
      backendRes.headers.get("set-cookie")?.split(/,(?=[^;]+=)/g) ||
      [];

    // kalau backend ERROR, arahkan ke callback error
    if (!backendRes.ok) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/Auth/callback?error=1`,
        307
      );
    }

    // jika backend OK → redirect ke dashboard
    const res = NextResponse.redirect(redirectPath, 307);

    setCookies.forEach((c) => res.headers.append("Set-Cookie", c));

    return res;
  } catch (err) {
    console.error("❌ ERROR DI NEXTJS CALLBACK:", err);
    return NextResponse.redirect(
      `${req.nextUrl.origin}/Auth/callback?error=1`,
      307
    );
  }
}

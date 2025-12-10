"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  const redirectPath = params.get("redirect") || "/Rumpi/Dashboard";

  useEffect(() => {
    async function checkSession() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { credentials: "include" }
      );

      if (res.ok) {
        router.replace(redirectPath);
      } else {
        router.replace("/Auth/Login");
      }
    }

    checkSession();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  );
}

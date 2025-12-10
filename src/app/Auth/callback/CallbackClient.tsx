"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  const redirectPath = params.get("redirect") || "/Rumpi/Dashboard";

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        );

        if (res.ok) router.replace(redirectPath);
        else router.replace("/Auth/Login");
      } catch {
        router.replace("/Auth/Login");
      }
    }

    checkLogin();
  }, [router, redirectPath]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold">Authenticating...</p>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}

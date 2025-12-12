"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get("redirect") || "/Rumpi/Dashboard";

  const [retry, setRetry] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        return router.replace(redirectPath);
      }

      if (retry < maxRetries) {
        setRetry((r) => r + 1);
        setTimeout(check, 1000);
      } else {
        router.replace("/Auth/Login");
      }
    }

    check();
  }, [retry, router, redirectPath]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Memverifikasi sesi...</div>
    </div>
  );
}

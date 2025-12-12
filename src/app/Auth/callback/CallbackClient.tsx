"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const redirectPath = params.get("redirect") || "/Rumpi/Dashboard";
  const errorParam = params.get("error");

  useEffect(() => {
    if (errorParam) {
      router.replace("/Auth/Login");
      return;
    }

    async function finalizeGoogleLogin() {
      try {
        // 1️⃣ PANGGIL CALLBACK PROXY DULU → INI YANG SET COOKIE!!!
        const callbackRes = await fetch(
          `/api/auth/google/callback?redirect=${redirectPath}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        console.log("Callback status:", callbackRes.status);

        // 2️⃣ Setelah callback → baru cek session
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const user = await res.json();
          console.log("User OK:", user);
          router.replace(redirectPath);
        } else {
          console.log("Session belum ada, retry…");
          setTimeout(finalizeGoogleLogin, 800);
        }
      } catch (err) {
        console.error("ERROR:", err);
        router.replace("/Auth/Login");
      }
    }

    finalizeGoogleLogin();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      {error ? (
        <>
          <div className="text-red-500 text-lg font-semibold">{error}</div>
          <p className="text-gray-500">Mengalihkan ke login...</p>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Memverifikasi sesi...</p>
        </>
      )}
    </div>
  );
}

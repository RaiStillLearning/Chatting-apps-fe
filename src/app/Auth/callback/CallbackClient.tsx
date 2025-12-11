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

    const maxRetries = 5;
    let timeoutId: NodeJS.Timeout;

    async function checkSession() {
      try {
        console.log(`🔍 Checking session... (attempt ${retryCount + 1}/5)`);

        // ✅ FIX PALING PENTING — PAKAI PROXY NEXTJS
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        console.log("📡 Response status:", res.status);

        if (res.ok) {
          const user = await res.json();
          console.log("✅ User authenticated:", user);

          setTimeout(() => router.replace(redirectPath), 300);
        } else {
          if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            timeoutId = setTimeout(checkSession, 1200);
          } else {
            setError("Session tidak ditemukan. Silakan login kembali.");
            setTimeout(() => router.replace("/Auth/Login"), 1500);
          }
        }
      } catch (err) {
        console.error("❌ Error checking session:", err);

        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          timeoutId = setTimeout(checkSession, 1200);
        } else {
          setError("Terjadi kesalahan. Silakan login kembali.");
          setTimeout(() => router.replace("/Auth/Login"), 1500);
        }
      }
    }

    checkSession();

    return () => timeoutId && clearTimeout(timeoutId);
  }, [router, retryCount, redirectPath, errorParam]);

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

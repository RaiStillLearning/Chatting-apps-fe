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
    // Handle error dari backend
    if (errorParam) {
      setTimeout(() => router.replace("/Auth/Login"), 2000);
      return;
    }

    const maxRetries = 5;
    let timeoutId: NodeJS.Timeout;

    async function checkSession() {
      try {
        console.log(
          `🔍 Checking session... (attempt ${retryCount + 1}/${maxRetries})`
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            credentials: "include",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📡 Response status:", res.status);

        if (res.ok) {
          const user = await res.json();
          console.log("✅ User authenticated:", user);

          // Small delay untuk ensure cookies fully set
          setTimeout(() => {
            router.replace(redirectPath);
          }, 500);
        } else {
          // Retry jika session belum ready
          if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            timeoutId = setTimeout(checkSession, 1500); // Retry setiap 1.5 detik
          } else {
            console.error("❌ Max retries reached");
            setError("Session tidak ditemukan. Silakan login kembali.");
            setTimeout(() => router.replace("/Auth/Login"), 2000);
          }
        }
      } catch (err) {
        console.error("❌ Check session error:", err);

        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          timeoutId = setTimeout(checkSession, 1500);
        } else {
          setError("Terjadi kesalahan. Silakan login kembali.");
          setTimeout(() => router.replace("/Auth/Login"), 2000);
        }
      }
    }

    checkSession();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [errorParam, redirectPath, router, retryCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      {error ? (
        <>
          <div className="text-red-500 text-lg font-semibold">❌ {error}</div>
          <p className="text-gray-500">Mengalihkan ke halaman login...</p>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
          <div className="text-center">
            <p className="text-gray-700 font-medium text-lg">
              Memverifikasi sesi...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Percobaan {retryCount + 1} dari 5
            </p>
          </div>
        </>
      )}
    </div>
  );
}

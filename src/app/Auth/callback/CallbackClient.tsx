"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  const redirectPath = params.get("redirect") || "/Rumpi/Dashboard";
  const errorParam = params.get("error");

  useEffect(() => {
    // ⭐ FIX 1: Handle error dari backend
    if (errorParam) {
      setError("Login gagal. Silakan coba lagi.");
      setTimeout(() => router.replace("/Auth/Login"), 2000);
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;

    async function checkSession() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            credentials: "include",
            cache: "no-store", // ⭐ FIX 2: Prevent cache
          }
        );

        if (res.ok) {
          const user = await res.json();
          console.log("✅ User authenticated:", user);
          router.replace(redirectPath);
        } else {
          // ⭐ FIX 3: Retry jika session belum ready
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`⏳ Retry ${retryCount}/${maxRetries}...`);
            setTimeout(checkSession, 1000); // Retry setelah 1 detik
          } else {
            setError("Session tidak ditemukan");
            setTimeout(() => router.replace("/Auth/Login"), 2000);
          }
        }
      } catch (err) {
        console.error("❌ Check session error:", err);
        setError("Terjadi kesalahan. Silakan login kembali.");
        setTimeout(() => router.replace("/Auth/Login"), 2000);
      }
    }

    checkSession();
  }, [errorParam, redirectPath, router]); // ⭐ FIX 4: Proper dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {error ? (
        <>
          <div className="text-red-500 text-lg">❌ {error}</div>
          <p className="text-gray-500">Mengalihkan ke halaman login...</p>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-700">Memverifikasi sesi...</p>
        </>
      )}
    </div>
  );
}

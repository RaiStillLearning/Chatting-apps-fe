"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    console.log("🔐 Attempting login via proxy...");

    try {
      // ⭐ Sekarang pakai path relatif /api karena proxy
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Still needed untuk cookie
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Login success:", data);

        // Verify session
        const verifyRes = await fetch("/api/auth/me", {
          credentials: "include",
        });

        console.log("🔍 Verify session:", verifyRes.status);

        if (verifyRes.ok) {
          console.log("✅ Session verified, redirecting...");
          router.replace("/Rumpi/Dashboard");
        } else {
          setError("Session gagal dibuat. Silakan coba lagi.");
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Login gagal");
        console.error("❌ Login failed:", errorData);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <LoginForm loading={loading} onSubmit={handleLogin} />
    </div>
  );
}

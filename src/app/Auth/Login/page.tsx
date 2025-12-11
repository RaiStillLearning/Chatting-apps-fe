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

    try {
      // 🔥 LOGIN LANGSUNG KE BACKEND TANPA PROXY
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // wajib untuk session
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        return setError(err.message || "Login gagal");
      }

      // 🔥 CEK SESSION MENGGUNAKAN BACKEND LANGSUNG
      const verify = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { credentials: "include" }
      );

      if (!verify.ok) {
        return setError("Session gagal. Silakan login ulang.");
      }

      router.replace("/Rumpi/Dashboard");
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    }

    setLoading(false);
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
  
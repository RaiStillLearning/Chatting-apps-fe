"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔥 WAJIB AGAR COOKIE TERSIMPAN
          body: JSON.stringify({ email, password }),
        }
      );

      if (res.ok) {
        router.replace("/Rumpi/Dashboard");
      } else {
        alert("Login gagal!");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
    }

    setLoading(false);
  }

  return <LoginForm loading={loading} onSubmit={handleLogin} />;
}

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

    const form = e.currentTarget;
    const data = new FormData(form);

    const email = data.get("email");
    const password = data.get("password");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include", // ✅ WAJIB untuk session
          headers: {
            "Content-Type": "application/json", // ✅ WAJIB
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      setLoading(false);

      if (res.ok) {
        router.push("/Rumpi/Dashboard");
      } else {
        const err = await res.json();
        alert(err.message || "Login gagal");
      }
    } catch (error) {
      setLoading(false);
      alert("Server error");
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        className="w-full max-w-md"
      />
    </main>
  );
}

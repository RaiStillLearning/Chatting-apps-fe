// app/auth/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/Rumpi/Dashboard");
    } else {
      // TODO: tampilkan error
      alert("Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <LoginForm
        className="w-full max-w-md"
        onSubmit={handleLogin}
        aria-busy={loading}
      />
    </main>
  );
}

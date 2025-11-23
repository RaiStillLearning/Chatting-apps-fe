"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignupForm } from "@/components/signup-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const body = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };

    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    setLoading(false);

    if (res.ok) {
      router.push("/Rumpi/Dashboard");
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message ?? "Signup gagal");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SignupForm
        className="w-full max-w-md"
        onSubmit={handleSignup}
        loading={loading}
      />
    </main>
  );
}

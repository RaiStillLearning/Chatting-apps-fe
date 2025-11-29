"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignupForm } from "@/components/signup-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    console.log("SIGNUP DATA:", form); // ✅ DEBUG

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      setLoading(false);

      if (res.ok) {
        router.push("/Rumpi/Dashboard");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message ?? "Signup gagal");
      }
    } catch (error) {
      setLoading(false);
      console.error("SIGNUP ERROR:", error);
      alert("Server tidak bisa dihubungi");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SignupForm
        className="w-full max-w-md"
        onSubmit={handleSignup}
        loading={loading}
        form={form}
        onChange={handleChange}
      />
    </main>
  );
}

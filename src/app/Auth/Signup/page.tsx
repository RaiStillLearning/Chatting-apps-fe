"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔥 WAJIB
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        router.replace("/Rumpi/Dashboard");
      } else {
        alert("Gagal membuat akun!");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);
    }

    setLoading(false);
  }

  return (
    <SignupForm
      loading={loading}
      onSubmit={onSubmit}
      form={form}
      onChange={onChange}
    />
  );
}

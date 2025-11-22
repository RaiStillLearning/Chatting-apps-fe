"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    console.log(payload);

    setLoading(false);
    router.push("/auth/login");
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

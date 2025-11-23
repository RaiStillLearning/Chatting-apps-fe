"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Rumpi/Dashboard");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold">Authenticating...</p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
}

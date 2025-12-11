"use client";

import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Google login…</div>}>
      <CallbackClient />
    </Suspense>
  );
}

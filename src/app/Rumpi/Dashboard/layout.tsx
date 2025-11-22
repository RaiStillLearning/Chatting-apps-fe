"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle"; // ← tambahkan ini

function RumpiInnerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 h-14 w-full flex items-center justify-between border-b px-4 bg-white shadow-sm dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>

            {/* Right area - Theme button */}
            <div className="flex items-center gap-2">
              <ThemeToggle /> {/* ← tombol muncul di kanan */}
            </div>
          </header>

          <main className="flex-1 w-full p-4">
            <div className="w-full max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function RumpiLayout({ children }: { children: ReactNode }) {
  return <RumpiInnerLayout>{children}</RumpiInnerLayout>;
}

"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function RumpiInnerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full" suppressHydrationWarning>
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 h-16 w-full flex items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />

              <div className="relative max-w-md flex-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search people..."
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <ThemeToggle />

              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 cursor-pointer hover:border-primary transition-colors"
              />
            </div>
          </header>

          <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-background">
            <div className="w-full max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function RumpiLayout({ children }: { children: ReactNode }) {
  return <RumpiInnerLayout>{children}</RumpiInnerLayout>;
}

"use client";

import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, sidebarData } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function RumpiInnerLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const mobileNavItems = sidebarData.navMain.slice(0, 5);

  return (
    <SidebarProvider>
      {/* Sidebar - shown only on lg and up, collapse supported */}
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4 flex-1">
            {/* Sidebar Trigger for desktop */}
            <SidebarTrigger className="hidden lg:flex" />

            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-2">
              <img
                src="/logo/pplg.png"
                alt="Rumpi"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold">Rumpi</span>
            </div>

            {/* Desktop search */}
            <div className="relative max-w-md flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search people..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Right side actions */}
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

        {/* Main Content */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-background pb-20 lg:pb-8">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="flex items-center justify-around h-16 px-2">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1 max-w-[80px]",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Search Sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="h-[100vh] sm:h-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Search</SheetTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search people..."
                className="pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}

export default function RumpiLayout({ children }: { children: ReactNode }) {
  return <RumpiInnerLayout>{children}</RumpiInnerLayout>;
}

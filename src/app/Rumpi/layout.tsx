"use client";

import { ReactNode, useState, useEffect } from "react";
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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { io } from "socket.io-client"; // ✅ FIX IMPORT

// 🎯 User type
type UserType = {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

function RumpiInnerLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState<UserType[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);

  const pathname = usePathname();
  const mobileNavItems = sidebarData.navMain.slice(0, 5);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // -------------------------------
  // SEARCH PEOPLE
  // -------------------------------
  const searchPeople = async (query: string) => {
    if (!query.trim()) return setResults([]);

    try {
      const res = await fetch(`${API_URL}/api/users/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchPeople(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // -------------------------------
  // FETCH CHAT LIST
  // -------------------------------
  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/list`, {
        credentials: "include",
      });

      if (res.ok) setChatList(await res.json());
    } catch (err) {
      console.error("FETCH CHAT LIST ERROR:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // -------------------------------
  // SOCKET LISTEN FOR CHAT UPDATES
  // -------------------------------
  useEffect(() => {
    const socket = io(API_URL, { withCredentials: true });

    socket.on("chat:updateList", () => {
      console.log("🔄 Updating chat list...");
      fetchChats();
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar chatList={chatList} /> {/* ✅ PASS CHATLIST KE SIDEBAR */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between border-b px-4 bg-background/95 backdrop-blur">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="hidden lg:flex" />

            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-2">
              <Image
                src="/logo/pplg.png"
                alt="Rumpi"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold">Rumpi</span>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />

              <Input
                type="search"
                placeholder="Search people..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* SEARCH RESULTS */}
              {results.length > 0 && searchQuery.trim() !== "" && (
                <div className="absolute top-10 left-0 w-full bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {results.map((user) => (
                    <Link
                      key={user._id}
                      href={`/Rumpi/profile/${user.username}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                    >
                      <Image
                        src={user.avatarUrl}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt="avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-accent rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <ThemeToggle />

            <Image
              src="/user-profile/default-avatar.png"
              alt="Profile"
              width={40}
              height={40}
              className="w-9 h-9 rounded-full border-2 cursor-pointer hover:border-primary transition"
            />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-background pb-20 lg:pb-8">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function RumpiLayout({ children }: { children: ReactNode }) {
  return <RumpiInnerLayout>{children}</RumpiInnerLayout>;
}

"use client";

import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bell,
  Search,
  Home,
  MessageCircle,
  Users,
  PlusSquare,
  User,
  X,
} from "lucide-react";
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
import {
  NotificationBusProvider,
  useNotificationBus,
} from "@/components/notification-bus-provider"; // ⭐ UPDATED
import { Toaster } from "@/components/ui/sonner"; // ⭐ ADDED

// 🎯 Type definitions
type UserType = {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

type ChatType = {
  _id: string;
  participants: UserType[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
};

type MobileNavItem = {
  title: string;
  icon: typeof Home;
  href: string;
  isActive: boolean;
  badge?: number;
};

type NotificationType = {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
};

function RumpiInnerLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ⭐ ADDED — get notifications from WebSocket
  const bus = useNotificationBus();
  const notifications = bus?.notifications ?? [];
  useEffect(() => {
    setUnreadNotificationsCount(notifications.length);
    fetchChats(); // refresh unread chat badge
  }, [notifications]);

  // Mobile Navigation Items
  const mobileNavItems: MobileNavItem[] = [
    {
      title: "Home",
      icon: Home,
      href: "/Rumpi",
      isActive: pathname === "/Rumpi",
    },
    {
      title: "Messages",
      icon: MessageCircle,
      href: "/Rumpi/messages",
      isActive: pathname.startsWith("/Rumpi/messages"),
      badge: unreadMessagesCount, // ⭐ UPDATED
    },
    {
      title: "Create",
      icon: PlusSquare,
      href: "/Rumpi/create",
      isActive: pathname === "/Rumpi/create",
    },
    {
      title: "Community",
      icon: Users,
      href: "/Rumpi/community",
      isActive: pathname === "/Rumpi/community",
    },
    {
      title: "Profile",
      icon: User,
      href: "/Rumpi/Dashboard/profile/me",
      isActive: pathname.startsWith("/Rumpi/Dashboard/profile/me"),
    },
  ];

  // -------------------------------
  // SEARCH PEOPLE
  // -------------------------------
  const searchPeople = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data: UserType[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      searchPeople(searchQuery);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);
  // -------------------------------
  // FETCH CHAT LIST & COUNT UNREAD
  // -------------------------------
  const fetchChats = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/chat/list`, {
        credentials: "include",
      });

      if (res.ok) {
        const data: ChatType[] = await res.json();
        setChatList(data);

        // Count total unread messages
        const totalUnread = data.reduce(
          (sum, chat) => sum + (chat.unreadCount || 0),
          0
        );
        setUnreadMessagesCount(totalUnread);
      }
    } catch (err) {
      console.error("FETCH CHAT LIST ERROR:", err);
    }
  };

  // -------------------------------
  // FETCH NOTIFICATIONS COUNT
  // -------------------------------
  const fetchNotifications = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        credentials: "include",
      });

      if (res.ok) {
        const data: NotificationType[] = await res.json();
        const unreadCount = data.filter((notif) => !notif.read).length;
        setUnreadNotificationsCount(unreadCount);
      }
    } catch (err) {
      console.error("FETCH NOTIFICATIONS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchNotifications();
  }, []);
  // -------------------------------
  // SOCKET LISTEN FOR UPDATES
  // -------------------------------
  useEffect(() => {
    // Polling fallback (remove when socket.io is set up)
    const interval = setInterval(() => {
      fetchChats();
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [API_URL]);

  // Clear search when closing
  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <SidebarProvider>
      <AppSidebar />

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

            {/* Desktop Search Input */}
            <div className="relative max-w-md flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />

              <Input
                type="search"
                placeholder="Search people..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Desktop Search Results */}
              {results.length > 0 && searchQuery.trim() !== "" && (
                <div className="absolute top-10 left-0 w-full bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {results.map((user) => (
                    <Link
                      key={user._id}
                      href={`/Rumpi/Dashboard/profile/${user.username}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                      onClick={() => setSearchQuery("")}
                    >
                      <Image
                        src={user.avatarUrl}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt={`${user.displayName} avatar`}
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
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hidden md:flex"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
                </span>
              )}
            </Button>

            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            <Image
              src="/user-profile/default-avatar.png"
              alt="Profile"
              width={40}
              height={40}
              className="w-9 h-9 rounded-full border-2 cursor-pointer hover:border-primary transition hidden md:block"
            />
          </div>
        </header>

        {/* MOBILE SEARCH OVERLAY - Full Screen dengan Header */}
        {searchOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background">
            {/* Search Header */}
            <div className="sticky top-0 h-16 flex items-center gap-3 border-b px-4 bg-background">
              <Button variant="ghost" size="icon" onClick={handleCloseSearch}>
                <X className="w-5 h-5" />
              </Button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search people..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              {results.length > 0 ? (
                <div className="divide-y">
                  {results.map((user) => (
                    <Link
                      key={user._id}
                      href={`/Rumpi/Dashboard/profile/${user.username}`}
                      className="flex items-center gap-3 p-4 hover:bg-accent transition-colors"
                      onClick={handleCloseSearch}
                    >
                      <Image
                        src={user.avatarUrl}
                        width={48}
                        height={48}
                        className="rounded-full"
                        alt={`${user.displayName} avatar`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {user.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery.trim() !== "" ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching with a different keyword
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Search people</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start typing to find users
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-background pb-20 lg:pb-8">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="flex items-center justify-around h-16 px-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                    item.isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn("w-6 h-6", item.isActive && "fill-current")}
                    />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </SidebarProvider>
  );
}

export default function RumpiLayout({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((u) => setUserId(u._id))
      .catch(() => setUserId(null));
  }, []);

  if (!userId) return <RumpiInnerLayout>{children}</RumpiInnerLayout>;

  return (
    <NotificationBusProvider currentUserId={userId}>
      <Toaster richColors />
      <RumpiInnerLayout>{children}</RumpiInnerLayout>
    </NotificationBusProvider>
  );
}

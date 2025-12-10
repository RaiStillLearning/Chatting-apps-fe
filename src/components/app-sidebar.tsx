"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

import {
  User,
  Bell,
  Home,
  Settings2,
  MessageSquare,
  SquarePlus,
  Frame,
  PieChart,
  Map,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL!;

const defaultUser = {
  name: "Guest",
  email: "guest@example.com",
  avatar: "/user-profile/default-avatar.png",
};

const navData = {
  navMain: [
    { title: "Home", url: "/Rumpi/Dashboard", icon: Home },
    { title: "Chat", url: "/Rumpi/Dashboard/chat", icon: MessageSquare },
    { title: "Upload", url: "#", icon: SquarePlus },
    { title: "Profile", url: "/Rumpi/Dashboard/profile/me", icon: User },
    {
      title: "Notifications",
      url: "/Rumpi/Dashboard/notifications",
      icon: Bell,
    },
    { title: "Settings", url: "#", icon: Settings2 },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const [user, setUser] = React.useState(defaultUser);
  const [isAuth, setIsAuth] = React.useState(false);

  // ============================
  // CHAT LIST TYPES
  // ============================
  type ChatListUser = {
    _id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  };

  type ChatListItem = {
    _id: string;
    participants: ChatListUser[];
    otherUser: ChatListUser;
    lastMessage?: string;
    updatedAt: string;
  };

  const [chatList, setChatList] = React.useState<ChatListItem[]>([]);

  // ============================
  // LOAD CURRENT USER
  // ============================
  React.useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setUser({
          name: data.displayName,
          email: data.email,
          avatar: data.avatarUrl || "/user-profile/default-avatar.png",
        });

        setIsAuth(true);
      } catch {
        console.log("User not logged in");
      }
    }

    fetchMe();
  }, []);

  // ============================
  // LOAD CHAT LIST
  // ============================
  const fetchChatList = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/list`, {
        credentials: "include",
      });

      if (res.ok) {
        const list: ChatListItem[] = await res.json();
        setChatList(list);
      }
    } catch (err) {
      console.error("Chat list error:", err);
    }
  };

  React.useEffect(() => {
    fetchChatList();
  }, []);

  // ============================
  // SOCKET.IO RELOAD CHAT LIST
  // ============================
  React.useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("chat:updateList", () => {
      fetchChatList();
    });

    return () => {
      socket.disconnect(); // cleanup valid
    };
  }, []);

  // ============================
  // LOGOUT
  // ============================
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/Auth/Login");
      router.refresh();
    } catch {
      alert("Logout gagal");
    }
  }

  // ============================
  // RENDER
  // ============================
  return (
    <Sidebar
      collapsible="icon"
      className="group/sidebar hidden lg:flex"
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent className="px-2 py-3 md:py-4">
            <div className="flex items-center gap-2 px-1 md:px-2">
              <img
                src="/logo/pplg.png"
                className="w-8 h-8 rounded-lg object-cover group-data-[collapsible=icon]:hidden"
              />
              <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm md:text-base">
                  Rumpi
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground">
                  Social App
                </span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>

      {/* SIDEBAR CONTENT */}
      <SidebarContent>
        {/* MAIN NAV */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="my-2" />
      </SidebarContent>
      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <img
                src={user.avatar}
                className="size-8 rounded-full"
                alt={user.name}
              />
              <div className="flex flex-col gap-0.5 leading-none lg:group-data-[state=collapsed]/sidebar:hidden">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isAuth && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Logout"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                <LogOut />
                <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export { navData as sidebarData };

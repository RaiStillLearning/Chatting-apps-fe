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

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultUser = {
  name: "Guest",
  email: "guest@example.com",
  avatar: "/user-profile/default-avatar.png",
};

const navData = {
  navMain: [
    { title: "Home", url: "/Rumpi/Dashboard", icon: Home },
    { title: "Chat", url: "/Rumpi/chat", icon: MessageSquare },
    { title: "Upload", url: "#", icon: SquarePlus },
    { title: "Profile", url: "/Rumpi/profile/me", icon: User },
    { title: "Notifications", url: "#", icon: Bell },
    { title: "Settings", url: "#", icon: Settings2 },
  ],

  projects: [
    { name: "My Collections", url: "#", icon: Frame },
    { name: "Saved Posts", url: "#", icon: PieChart },
    { name: "Discover", url: "#", icon: Map },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const [user, setUser] = React.useState(defaultUser);
  const [isAuth, setIsAuth] = React.useState(false);

  // CHAT LIST
  const [chatList, setChatList] = React.useState<any[]>([]);

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
        setChatList(await res.json());
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

    return () => socket.disconnect();
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

        {/* PROJECT NAV */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3" />

        {/* =============================
              ⭐ RECENT CHAT LIST ⭐
        ============================== */}
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="text-xs px-4 mb-2 text-muted-foreground group-data-[collapsed]/sidebar:hidden">
              Recent Chats
            </p>

            {chatList.length === 0 && (
              <p className="text-xs px-4 text-muted-foreground group-data-[collapsed]/sidebar:hidden">
                Belum ada chat
              </p>
            )}

            <SidebarMenu>
              {chatList.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton asChild tooltip={chat.displayName}>
                    <Link
                      href={`/Rumpi/chat/${chat.username}`}
                      className="flex items-center gap-3"
                    >
                      <Image
                        src={
                          chat.avatarUrl || "/user-profile/default-avatar.png"
                        }
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        alt="avatar"
                      />
                      <div className="flex flex-col gap-0.5 leading-none lg:group-data-[state=collapsed]/sidebar:hidden">
                        <span className="font-medium">{chat.displayName}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {chat.lastMessage || "Mulai chat"}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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

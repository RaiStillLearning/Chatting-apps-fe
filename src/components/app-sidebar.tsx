"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { Separator } from "@/components/ui/separator";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultUser = {
  name: "Guest",
  email: "guest@example.com",
  avatar: "/user-profile/default-avatar.png",
};

const navData = {
  navMain: [
    { title: "Home", url: "/Rumpi/Dashboard", icon: Home },
    { title: "Chat", url: "#", icon: MessageSquare },
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

  // ✅ AMBIL USER DARI SESSION
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
          avatar:
            data.avatarUrl ?? `/user-profile/default-avatar.png${data.email}`,
        });
        setIsAuth(true);
      } catch (error) {
        console.log("Not logged in");
      }
    }

    fetchMe();
  }, []);

  // ✅ LOGOUT FUNCTION
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/Auth/Login");
      router.refresh();
    } catch (error) {
      alert("Logout gagal");
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="group/sidebar hidden lg:flex"
      {...props}
    >
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent className="px-2 py-3 md:py-4">
            <div className="flex items-center gap-2 px-1 md:px-2">
              <img
                src="/logo/pplg.png"
                alt="Rumpi Logo"
                className="w-8 h-8 rounded-lg object-cover group-data-[collapsible=icon]:hidden"
              />
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.url}>
                      <item.icon />
                      <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                        {item.name}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <img
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.src = "/user-profile/default-avatar.png";
                }}
                className="size-8 rounded-full"
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Logout"
                    className="text-red-500 hover:text-red-600"
                  >
                    <LogOut />
                    <span className="lg:group-data-[state=collapsed]/sidebar:hidden">
                      Logout
                    </span>
                  </SidebarMenuButton>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah kamu yakin ingin keluar dari akun ini?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Ya, Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export { navData as sidebarData };

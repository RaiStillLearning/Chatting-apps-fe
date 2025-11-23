"use client";

import * as React from "react";
// ❌ HAPUS useSession
// import { useSession } from "next-auth/react";

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

// future: fetch profile from express token
const defaultUser = {
  name: "Guest",
  email: "guest@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
};

const navData = {
  navMain: [
    { title: "Home", url: "/Rumpi/Dashboard", icon: Home },
    { title: "Chat", url: "#", icon: MessageSquare },
    { title: "Upload", url: "#", icon: SquarePlus },
    { title: "Profile", url: "#", icon: User },
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
  // ❌ Tidak ada useSession lagi
  const user = defaultUser;

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
            <SidebarMenuButton asChild size="lg">
              <a href="#profile">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-8 rounded-full"
                />
                <div className="flex flex-col gap-0.5 leading-none lg:group-data-[state=collapsed]/sidebar:hidden">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export { navData as sidebarData };

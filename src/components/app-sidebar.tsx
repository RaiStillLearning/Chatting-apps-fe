"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
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

import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shadcn",
  },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent className="px-2 py-4">
            <div className="flex items-center gap-2 px-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Rumpi</span>
                <span className="text-xs text-muted-foreground">
                  Social App
                </span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
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
                  src={data.user.avatar}
                  alt={data.user.name}
                  className="size-8 rounded-full"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{data.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {data.user.email}
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

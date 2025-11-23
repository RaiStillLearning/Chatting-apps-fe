"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Rumpi",
      logo: GalleryVerticalEnd,
      plan: "Cihuyy",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Feed",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Explore",
          url: "#",
        },
        {
          title: "Following",
          url: "#",
        },
        {
          title: "Trending",
          url: "#",
        },
      ],
    },
    {
      title: "Communities",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Technology",
          url: "#",
        },
        {
          title: "Design",
          url: "#",
        },
        {
          title: "Photography",
          url: "#",
        },
      ],
    },
    {
      title: "Discover",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Top Posts",
          url: "#",
        },
        {
          title: "New Users",
          url: "#",
        },
        {
          title: "Topics",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Privacy",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "My Collections",
      url: "#",
      icon: Frame,
    },
    {
      name: "Saved Posts",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Bookmarks",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

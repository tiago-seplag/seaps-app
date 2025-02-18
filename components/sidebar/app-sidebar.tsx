"use client";
import * as React from "react";
import { ChartColumnIncreasing, ClipboardList, Landmark } from "lucide-react";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "../../assets/logo-gov.png";
import Image from "next/image";

const data = {
  user: {
    name: "User Name",
    email: "username@seplag.mt.gov.br",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocIk7vnKxUOaeEVoaQkzQ1s11ExqrTUUBKOWOu0oPx57covk9Q4=s288-c-no",
  },
  navMain: [
    {
      title: "Checklists",
      url: "/checklists",
      icon: ClipboardList,
    },
    {
      title: "Orgãos",
      url: "/organizations",
      icon: Landmark,
    },
  ],
};

const activeLink = "text-foreground font-bold";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Image
                src={Logo}
                alt="logo"
                className="flex aspect-square size-8 items-center justify-center rounded-lg"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SEAPS</span>
                <span className="truncate text-xs">
                  Sistema de Manutenção Predial
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{
                  children: "Dashboard",
                  hidden: false,
                }}
                className={cn(
                  "px-2.5 transition-colors md:px-2",
                  pathname === "/" ? activeLink : "text-foreground/60",
                )}
              >
                <Link href={"/"}>
                  <ChartColumnIncreasing />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: item.title,
                    hidden: false,
                  }}
                  className={cn(
                    "px-2.5 transition-colors md:px-2",
                    pathname.startsWith(item.url)
                      ? activeLink
                      : "text-foreground/60",
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

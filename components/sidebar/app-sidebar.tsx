"use client";
import * as React from "react";
import {
  Boxes,
  ChartColumnIncreasing,
  ClipboardList,
  Landmark,
} from "lucide-react";
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
    avatar: "http://localhost.com",
  },
  navMain: [
    {
      title: "Checklists",
      url: "/checklists",
      icon: ClipboardList,
    },
    {
      title: "Imóveis",
      url: "/properties",
      icon: Landmark,
    },
    {
      title: "Modelos",
      url: "/models",
      icon: Boxes,
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
            <SidebarMenuButton size="lg" className="h-full">
              <Image
                src={Logo}
                alt="logo"
                className="flex aspect-square size-8 items-center justify-center rounded-lg"
              />
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">SEAPS</span>
                <span className="text-sm">Sistema de Manutenção Predial</span>
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
                size="lg"
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
                  size="lg"
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

"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Boxes,
  ChartColumnIncreasing,
  ClipboardList,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const activeLink = "text-foreground font-bold";

const navMain = [
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
];

export const NavSidebar = () => {
  const pathname = usePathname();

  return (
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
        {navMain.map((item) => (
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
  );
};

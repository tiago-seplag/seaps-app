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
  Users,
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
    role: ["EVALUATOR", "SUPERVISOR", "ADMIN"],
  },
  {
    title: "Imóveis",
    url: "/properties",
    icon: Landmark,
    role: ["SUPERVISOR", "ADMIN"],
  },
  {
    title: "Modelos",
    url: "/models",
    icon: Boxes,
    role: ["ADMIN"],
  },
  {
    title: "Usuários",
    url: "/users",
    icon: Users,
    role: ["ADMIN"],
  },
];

export const NavSidebar = ({
  user,
}: {
  user: {
    role: string;
  };
}) => {
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
        {navMain
          .filter((item) => item.role.includes(user.role))
          .map((item) => (
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

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Logo from "../../public/logo-gov.png"
import Image from "next/image";
import { NavSidebar } from "./nav-sidebar";

import { version } from "@/package.json";
import { getUser } from "@/lib/dal";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

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
      <SidebarContent>{user && <NavSidebar user={user} />}</SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              avatar: user.avatar || undefined,
              email: user.email,
              name: user.name,
            }}
            version={version}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { UserProvider } from "@/contexts/user-context";
import { cookies } from "next/headers";

export default async function Layout({
  children,
  breadcrumb,
}: Readonly<{
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="gap-2 py-2">
        <header className="mx-2 flex h-16 items-center justify-between gap-2 rounded border bg-card px-4 shadow">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            {breadcrumb}
          </div>
          <ModeToggle />
        </header>
        <div className="mx-2 h-full rounded border bg-card p-4 shadow">
          <UserProvider>{children}</UserProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

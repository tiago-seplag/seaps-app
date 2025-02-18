import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function Layout({
  children,
  breadcrumb,
}: Readonly<{
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 shadow">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            {breadcrumb}
          </div>
          <ModeToggle />
        </header>
        <div className="m-2 rounded border p-4 shadow dark:bg-card-foreground/5 h-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

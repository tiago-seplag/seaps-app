"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

const activeLink = "text-foreground font-bold";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden sm:flex">
      <Link
        href="/"
        className="mr-4 flex items-center space-x-2 lg:mr-6"
      >
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">GOV</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/checklists"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/checklists" ? activeLink : "text-foreground/60",
          )}
        >
          Checklists
        </Link>
        <Link
          href="/organizations"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/organizations")
              ? activeLink
              : "text-foreground/60",
          )}
        >
          Orgãos
        </Link>
      </nav>
    </div>
  );
}

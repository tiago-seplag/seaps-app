"use client";

import * as React from "react";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HTMLMetaElement extends HTMLElement {
  content?: string;
}

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();

  const DARK_THEME = "#17181c";
  const LIGHT_THEME = "#ffffff";

  React.useEffect(() => {
    const themeColor: HTMLMetaElement | null =
      window.document.getElementById("theme-content");

    if (themeColor) {
      if (theme === "dark") {
        themeColor.content = DARK_THEME;
      }
      if (theme === "light") {
        themeColor.content = LIGHT_THEME;
      }
      if (theme === "system") {
        themeColor.content = systemTheme === "dark" ? DARK_THEME : LIGHT_THEME;
      }
    }
  }, [theme, systemTheme]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="absolute h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

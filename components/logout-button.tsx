"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { config } from "@/utils/mt-login";

export const LogoutButton = () => {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
      .then(() => router.push(config.url_logout))
      .catch((e) => console.log(e));
  };
  return (
    <Button onClick={logout}>
      <LogOut />
      Sair
    </Button>
  );
};

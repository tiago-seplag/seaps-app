"use client";

import { config } from "@/utils/mt-login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutComponent() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then(() => router.push(config.url_logout))
      .catch((e) => console.log(e));
  }, [router]);

  return <div></div>;
}

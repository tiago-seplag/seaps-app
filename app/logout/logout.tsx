"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutComponent() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then(() =>
        router.push(
          "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/logout?client_id=projeto-template-integracao&redirect_uri=http://172.16.146.58:3000&response_type=code",
        ),
      )
      .catch((e) => console.log(e));
  }, [router]);

  return <div></div>;
}

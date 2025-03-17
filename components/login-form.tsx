"use client";
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/utils/mt-login";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo-gov.png";

export function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const code = params.get("code");

    if (code) {
      //obtem o token
      fetch("/api/auth/login?code=" + code, {
        method: "POST",
        body: new URLSearchParams({ code: code }),
      })
        .then((data) => data.json())
        .then(() => router.push("/"));
    }
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="grid min-h-[547px] p-0 md:grid-cols-2">
          <form className="self-center p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Sistema de Manutenção Predial
                </h1>
                <p className="text-balance text-muted-foreground">
                  Bem-vindo de volta
                </p>
              </div>
              <Button
                type="button"
                className="h-12 w-full py-1"
                asChild
                size={"lg"}
              >
                <Link href={config.url_login}>
                  <img
                    alt="mt-login-logo"
                    className="h-full"
                    src="https://dev.login.mt.gov.br/auth/resources/3fl3k/login/mtlogin_v3/dist/assets/icon-DH2B8051.png"
                  />
                  Entrar com MT Login
                </Link>
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="flex h-full items-center justify-center bg-[#1a3180]">
              <Image
                src={Logo}
                width={160}
                alt="Image"
                className="inset-0 w-40 object-fill"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/utils/mt-login";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo-gov.png";
import MtLoginLogo from "../public/mt-login.png";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Insira seu email"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Insira sua senha"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold">
                    ENTRAR
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    className="h-12 w-full py-1 font-bold uppercase"
                    asChild
                    size={"lg"}
                  >
                    <Link href={config.url_login}>
                      Entrar com
                      <Image
                        src={MtLoginLogo}
                        width={40}
                        height={40}
                        alt={"MT Login Logo"}
                      />
                    </Link>
                  </Button>
                </div>
              </div>
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

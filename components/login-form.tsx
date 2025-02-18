import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo-gov.png";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="button" className="w-full" asChild>
                <Link href="/">Entrar</Link>
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

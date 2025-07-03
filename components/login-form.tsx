"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/utils/mt-login";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/logo-gov.png"
import MtLoginLogo from "../public/mt-login.png";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Insira seu email",
    })
    .email({
      message: "Insira um email valido",
    }),
  password: z.string().min(2, {
    message: "Insira sua senha",
  }),
});

export function LoginForm() {
  const router = useRouter();

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const code = params.get("code");

    if (code) {
      //obtem o token
      fetch("/api/auth/mt-login?code=" + code, {
        method: "POST",
        body: new URLSearchParams({ code: code }),
      })
        .then((data) => data.json())
        .then(() => router.push("/"));
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return axios
      .post("api/auth/login", values)
      .then(() => router.push("/"))
      .catch((e) => console.log(e));
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="grid min-h-[547px] p-0 md:grid-cols-2">
          <div className="self-center p-6 md:p-8">
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex w-full flex-col gap-2"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="ml-3">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Insira seu email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="ml-3">Senha</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  className="w-full"
                                  placeholder="Insira seu email"
                                  type={isShow ? "text" : "password"}
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                className="min-w-9"
                                size={"icon"}
                                onClick={() => setIsShow(!isShow)}
                              >
                                {isShow ? <Eye /> : <EyeClosed />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="mt-6 w-full font-bold">
                        ENTRAR
                      </Button>
                    </form>
                  </Form>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    OU
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
          </div>
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

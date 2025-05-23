"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useUser } from "@/contexts/user-context";

const profileFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
export function ProfileForm() {
  const { user } = useUser();

  const [tempPassword, setTempPassword] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.name,
      email: user?.email,
    },
    mode: "onChange",
  });

  async function onSubmit() {
    return axios
      .put("/api/users/generate-password")
      .then(({ data }) => {
        toast.success("Senha gerada com sucesso!");
        setTempPassword(data.password);
      })
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-3"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input disabled placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Gerar Senha</FormLabel>
          <div className="flex gap-2">
            <div
              className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
              // className="disabled:opacity-100"
            >
              {tempPassword}
            </div>
            <Button type="button" onClick={onSubmit}>
              Gerar
            </Button>
          </div>
          <FormDescription>
            Gerar senha temporária para login no app.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </form>
    </Form>
  );
}

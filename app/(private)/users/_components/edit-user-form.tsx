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

import { $Enums } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "@/components/ui/button";

const profileFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  is_active: z.boolean(),
  role: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function EditUserForm({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: $Enums.ROLES;
    is_active: boolean;
  } | null;
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.name,
      email: user?.email,
      is_active: user?.is_active,
      role: user?.role,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    return axios
      .put("/api/users/" + user?.id + "/config", {
        is_active: values.is_active,
        role: values.role,
      })
      .then(({}) => {
        toast.success("Usuário atualizado!");
      })
      .catch((e) => {
        if (e.response.data.messages?.length > 0) {
          e.response.data.messages.map((msg: string) => toast.error(msg));
        } else if (e.response.data.message) {
          toast.error(e.response.data.message);
        }
      });
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
          <FormLabel>Configurações</FormLabel>
          <FormItem>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ativação do usuário</FormLabel>
                    <FormDescription>
                      Quando ativo, o usuário terá acesso básico ao sistema.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormItem>

          <FormItem>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
                  <div className="w-1/2 space-y-0.5">
                    <FormLabel>Perfil de Acesso</FormLabel>
                    <FormDescription>
                      ADMINISTRADOR: Responsável pela gestão geral do sistema.
                    </FormDescription>
                    <FormDescription>
                      SUPERVISOR: Responsável por gerenciar os dados principais.
                    </FormDescription>
                    <FormDescription>
                      AVALIADOR: Responsável por executar os checklists.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={user?.role}
                      disabled={user?.role === "ADMIN"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-1/2">
                          <SelectValue placeholder="Selecione o Perfil de acesso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { id: "ADMIN", name: "ADMINISTRADOR" },
                          { id: "EVALUATOR", name: "AVALIADOR" },
                          { id: "SUPERVISOR", name: "SUPERVISOR" },
                        ].map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            disabled={item.id === "ADMIN"}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </FormItem>
        </FormItem>
        <div className="flex justify-end">
          <Button type="submit" className="self-end">
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Organization } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  name: z.string().min(2, {
    message: "Insira o nome do imóvel",
  }),
  address: z.string().optional(),
  type: z.string({
    message: "Selecione o tipo do imóvel",
  }),
});

export function CreatePropertyForm({
  organizationId,
}: {
  organizationId?: string;
}) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: organizationId,
      address: "",
      name: "",
    },
  });

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return axios
      .post("/api/properties", values)
      .then(() => router.replace("/checklists"))
      .catch((e) => console.log(e));
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="organization_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Orgão</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={organizationId}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tipo de Imóvel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={organizationId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"OWN"}>PRÓPRIO</SelectItem>
                    <SelectItem value={"RENTED"}>ALUGADO</SelectItem>
                    <SelectItem value={"GRANT"}>CONCESSÃO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do imóvel ou local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex.: R. C, S/N - Centro Político Administrativo..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

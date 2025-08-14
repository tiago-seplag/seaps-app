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
import { useRouter, useSearchParams } from "next/navigation";
import { AddressForm } from "../_components/address-form";
import { api } from "@/lib/axios";
import { NameForm } from "../_components/name-form";

const formSchema = z.object({
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  name: z.string().min(2, {
    message: "Insira o nome do imóvel",
  }),
  cep: z.string().min(7, {
    message: "Insira o CEP do imóvel",
  }),
  state: z.string().min(1, {
    message: "Insira o estado do imóvel",
  }),
  city: z.string().min(1, {
    message: "Insira a cidade do imóvel",
  }),
  neighborhood: z.string().min(7, {
    message: "Insira o bairro do imóvel",
  }),
  street: z.string().min(7, {
    message: "Insira a rua do imóvel",
  }),
  address: z.string().optional(),
  type: z.string({
    message: "Selecione o tipo do imóvel",
  }),
});

export function CreatePropertyForm() {
  const router = useRouter();
  const searhParams = useSearchParams();

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: searhParams.get("organization_id") || undefined,
    },
  });

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return api
      .post("/api/properties/", values)
      .then(({ data }) => router.replace("/properties/" + data.id + "/edit"))
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-lg flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Orgão</FormLabel>
              <Select
                disabled={!!form.getValues("name") && field.value !== undefined}
                onValueChange={field.onChange}
                defaultValue={searhParams.get("organization_id") || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Orgão" />
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
              <Select onValueChange={field.onChange}>
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
        <NameForm form={form} />
        <AddressForm form={form} />
        <Button type="submit" className="self-end">
          Criar
        </Button>
      </form>
    </Form>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { api } from "@/lib/axios";
import { RSSelect } from "@/components/react-select";
import { AddressForm } from "../../_components/address-form";
import { NameForm } from "../../_components/name-form";

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
  state: z.string({
    message: "Selecione o estado do imóvel",
  }),
  city: z.string({
    message: "Selecione a cidade do imóvel",
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
  person_id: z.string().uuid().optional(),
});

export function EditPropertyForm({ property }: { property: any }) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [responsible, setResponsible] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property.name,
      cep: property.cep || "",
      state: property.state || "",
      city: property.city || "",
      neighborhood: property.neighborhood || "",
      street: property.street || "",
      address: property.address || "",
      organization_id: property.organization_id,
      person_id: property.person_id || undefined,
      type: property.type,
    },
  });

  const [organization_id] = form.watch(["organization_id"]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  useEffect(() => {
    fetch("/api/organizations/" + organization_id + "/responsible")
      .then((response) => response.json())
      .then((data) => setResponsible(data));
  }, [organization_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return api
      .put("/api/properties/" + property.id, values)
      .then(() => router.replace("/properties"));
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
                defaultValue={property.organization_id}
                onValueChange={field.onChange}
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
          name="person_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Responsável</FormLabel>
              <div className="flex w-full items-center gap-2">
                <RSSelect
                  {...field}
                  placeholder="Selecione o Responsável pelo Imóvel"
                  options={responsible}
                  onChange={(val) => {
                    field.onChange(val ? val.id : undefined);
                  }}
                  value={
                    responsible.find((user) => user.id === field.value) ||
                    undefined
                  }
                />
                <Button
                  type="button"
                  disabled={!form.getValues("organization_id")}
                  variant={"default"}
                  onClick={() => {
                    router.push(
                      "/responsible/create?organization_id=" +
                        form.getValues("organization_id"),
                    );
                  }}
                  size="icon"
                >
                  <Plus />
                </Button>
              </div>
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
                defaultValue={property.type || ""}
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
        <NameForm form={form} />
        <AddressForm form={form} />
        <Button type="submit" className="self-end">
          Salvar
        </Button>
      </form>
    </Form>
  );
}

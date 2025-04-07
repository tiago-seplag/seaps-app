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
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toUpperCase } from "@/lib/utils";
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
  person_id: z.string({
    message: "Selecione o Responsável pelo imóvel",
  }),
});

export function CreatePropertyForm() {
  const router = useRouter();
  const searhParams = useSearchParams();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [responsible, setResponsible] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: searhParams.get("organization_id") || undefined,
      address: "",
      name: "",
    },
  });

  const [organization_id] = form.watch(["organization_id"]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  useEffect(() => {
    if (organization_id) {
      fetch("/api/organizations/" + organization_id + "/responsible")
        .then((response) => response.json())
        .then((data) => setResponsible(data));
    }
  }, [organization_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return axios
      .post("/api/properties/", values)
      .then(() => router.replace("/properties"))
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
          name="person_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Responsável</FormLabel>
              <div className="flex w-full items-center gap-2">
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Responsável pelo Imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {responsible.map((person) => (
                      <SelectItem key={person.id} value={String(person.id)}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do imóvel ou local"
                  {...field}
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
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
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">
          Criar
        </Button>
      </form>
    </Form>
  );
}

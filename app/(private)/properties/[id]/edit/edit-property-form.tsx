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
import { Organization, Property } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { editProperty } from "@/app/actions/edit-property";

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
  person_id: z.string(),
});

export function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [responsible, setResponsible] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: property.address || "",
      name: property.name,
      organization_id: property.organization_id,
      person_id: property.person_id || "",
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
    await editProperty(values, property.id);
    router.replace("/properties");
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
                disabled
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
              <FormLabel>Responsavel</FormLabel>
              <div className="flex w-full items-center gap-2">
                <Select
                  defaultValue={property.person_id || ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Orgão" />
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
        <Button type="submit" className="self-end">
          Salvar
        </Button>
      </form>
    </Form>
  );
}

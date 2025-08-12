"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Organization, User } from "@prisma/client";
import { getFirstAndLastName, toUpperCase } from "@/lib/utils";
import axios from "axios";
import { Input } from "@/components/ui/input";

const filterSchema = z.object({
  organization: z.string().optional(),
  user: z.string().optional(),
  status: z.string().optional(),
  property_name: z.string().optional(),
});

export function DataFilterForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      property_name: searchParams.get("property_name") || "",
    },
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleClearSearch = () => {
    form.reset({
      organization: "",
      user: "",
      status: "",
      property_name: "",
    });
    replace(pathname);
  };

  useEffect(() => {
    axios
      .get("/api/organizations")
      .then(({ data }) => setOrganizations(data))
      .catch((e) => console.log(e));
    axios
      .get("/api/v1/users")
      .then(({ data }) => setUsers(data.data))
      .catch((e) => console.log(e));
  }, []);

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    Object.entries(values).forEach((item) => {
      if (item[1]) params.set(item[0], item[1]);
    });

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
      >
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orgão</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={searchParams.get("organization") || undefined}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger value={field.value}>
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
          name="property_name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome do Imóvel</FormLabel>
              <Input
                {...field}
                placeholder="Insira o nome do Imóvel"
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={searchParams.get("responsible") || undefined}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {getFirstAndLastName(item.name)}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={searchParams.get("status") || undefined}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN">ABERTO</SelectItem>
                  <SelectItem value="CLOSED">FECHADO</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-full space-x-2 self-end justify-self-end">
          <Button type="submit">Filtrar</Button>
          <Button
            variant="ghost"
            type="button"
            onClick={handleClearSearch}
            className="px-2 lg:px-3"
          >
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}

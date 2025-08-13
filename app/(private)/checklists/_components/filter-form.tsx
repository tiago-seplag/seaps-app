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
import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { RSSelect } from "@/components/react-select";
import { api } from "@/lib/axios";
import { Label } from "@/components/ui/label";

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
      user: searchParams.get("user") || "",
    },
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      api.get("/api/organizations").then(({ data }) => setOrganizations(data));
      api.get("/api/v1/users").then(({ data }) => setUsers(data.data));
    } catch (err) {
      console.error("Error fetching filter data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    Object.entries(values).forEach((item) => {
      if (item[1]) params.set(item[0], item[1]);
    });

    replace(`${pathname}?${params.toString()}`);
  }

  if (loading) {
    return <LoadingSkeleton />;
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
              <RSSelect
                {...field}
                placeholder="Selecione o Responsável"
                options={users}
                onChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                value={
                  users.find((user) => user.id === field.value) || undefined
                }
              />
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
                    <SelectValue placeholder="Selecione o Status" />
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

export const LoadingSkeleton = () => {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <div className="w-full space-y-2">
        <Label>Orgão</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Orgão" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-2">
        <Label>Nome do Imóvel</Label>
        <Input placeholder="Insira o nome do Imóvel" />
      </div>
      <div className="w-full space-y-2">
        <Label>Responsável</Label>
        <RSSelect placeholder="Selecione o Responsável" options={[]} />
      </div>
      <div className="w-full space-y-2">
        <Label>Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Status" />
          </SelectTrigger>
        </Select>
      </div>
      <div className="col-span-full space-x-2 self-end justify-self-end">
        <Button type="submit" disabled>
          Filtrar
        </Button>
        <Button variant="ghost" type="button" className="px-2 lg:px-3" disabled>
          Limpar
        </Button>
      </div>
    </div>
  );
};

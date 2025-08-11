/* eslint-disable react-hooks/exhaustive-deps */
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
import { useCallback, useEffect, useState } from "react";
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
import debounce from "lodash.debounce";
import { formatCEP, toUpperCase } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

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

  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: searhParams.get("organization_id") || undefined,
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
      .post("/api/properties/", values)
      .then(({ data }) => router.replace("/properties/" + data.id + "/edit"))
      .catch((e) => console.log(e));
  }

  async function findAddressByCEP(cep: string) {
    await axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (response.data.erro) {
          toast.error("CEP inválido ou não encontrado.");
          return;
        }
        const { data } = response;
        form.setValue("state", data.uf?.toUpperCase());
        form.setValue("city", data.localidade?.toUpperCase());
        form.setValue("neighborhood", data.bairro?.toUpperCase());
        form.setValue("street", data.logradouro?.toUpperCase());
        form.setValue("address", `${data.logradouro}, ${data.bairro}`);
      })
      .catch(() => toast.error("CEP inválido ou não encontrado."));
  }

  const checkNameExists = async (name: string) => {
    if (!name) {
      form.clearErrors("name");
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch(
        `/api/v1/properties/check?name=${encodeURIComponent(name)}`,
      );
      const { ok } = await res.json();

      if (!ok) {
        form.setError("name", {
          type: "manual",
          message: "É possivel que este imóvel já tenha sido criado",
        });
      } else {
        form.clearErrors("name");
      }
    } catch {
      form.setError("name", {
        type: "manual",
        message: "Erro ao verificar nome",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const debouncedCheckName = useCallback(debounce(checkNameExists, 500), []);

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
                <div className="relative">
                  <Input
                    placeholder="Nome do imóvel ou local"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedCheckName(e.target.value);
                    }}
                    onBlur={(e) => field.onChange(toUpperCase(e))}
                  />
                  {isChecking && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2Icon className="animate-spin" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          defaultValue={""}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do imóvel ou local"
                  onChange={(e) => {
                    field.onChange(formatCEP(e));
                    if (e.target.value.length === 9) {
                      findAddressByCEP(e.target.value.replace("-", ""));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          defaultValue={""}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do imóvel ou local"
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          defaultValue={""}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do imóvel ou local"
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neighborhood"
          defaultValue={""}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do imóvel ou local"
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          defaultValue={""}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do imóvel ou local"
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
          defaultValue={""}
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

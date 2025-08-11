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
import { useRouter } from "next/navigation";
import { Loader2Icon, Plus } from "lucide-react";
import axios from "axios";
import { formatCEP, toUpperCase } from "@/lib/utils";
import debounce from "lodash.debounce";
import { toast } from "sonner";

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
  person_id: z.string().uuid().optional(),
});

export function EditPropertyForm({ property }: { property: any }) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [responsible, setResponsible] = useState<Organization[]>([]);
  const [isChecking, setIsChecking] = useState(false);

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
    return axios
      .put("/api/properties/" + property.id, values)
      .then(() => router.replace("/properties"))
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
                <Select
                  defaultValue={property.person_id || ""}
                  onValueChange={field.onChange}
                >
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
            <FormItem className="relative w-full">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do imóvel ou local"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedCheckName(e.target.value);
                  }}
                  onBlur={(e) => field.onChange(toUpperCase(e))}
                />
              </FormControl>
              {isChecking && (
                <Loader2Icon className="absolute right-0 top-0 animate-spin" />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
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

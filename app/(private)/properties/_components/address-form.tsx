"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCEP, states, toUpperCase } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { RSOption, RSSelect } from "@/components/react-select";
import debounce from "lodash.debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AddressForm({ form }: any) {
  const [cities, setCities] = useState<RSOption[]>([]);

  const state = form.watch("state");

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
        form.setValue(
          "address",
          `${data.logradouro} - ${data.bairro}, ${data.localidade} - ${data.uf}, ${data.cep}`.toUpperCase(),
        );
      })
      .catch(() => toast.error("CEP inválido ou não encontrado."));
  }

  useEffect(() => {
    if (state) {
      axios
        .get(
          `https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`,
        )
        .then(({ data }) => {
          setCities(
            data.map((city: { nome: string; codigo_ibge: string }) => ({
              id: city.nome.replace(/\s*\(.*?\)/g, ""),
              name: city.nome.replace(/\s*\(.*?\)/g, ""),
            })),
          );
        })
        .catch(() => toast.error("Erro ao buscar as cidades"));
    }
  }, [state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedfindAddressByCEP = useCallback(
    debounce(findAddressByCEP, 300),
    [],
  );

  return (
    <>
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
                    debouncedfindAddressByCEP(e.target.value.replace("-", ""));
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Estado do imóvel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.acronym} value={state.acronym}>
                      {state.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <RSSelect
                {...field}
                placeholder="Selecione a Cidade Imóvel"
                options={cities}
                onChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                value={
                  cities.find((user) => user.id === field.value) || undefined
                }
                isDisabled={!form.getValues("state")}
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
                placeholder="Nome do Bairro do imóvel"
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
                placeholder="Rua do imóvel ou local"
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
    </>
  );
}

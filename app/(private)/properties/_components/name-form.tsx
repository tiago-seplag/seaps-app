"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { toUpperCase } from "@/lib/utils";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { UseFormReturn } from "react-hook-form";
import debounce from "lodash.debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NameForm = ({ form }: { form: UseFormReturn<any> }) => {
  const { id } = useParams();

  const [isChecking, setIsChecking] = useState(false);

  const checkNameExists = async (name: string) => {
    if (!name) {
      form.clearErrors("name");
      return;
    }

    setIsChecking(true);

    try {
      const { data } = await api.get(`/api/v1/properties/check`, {
        params: {
          name: name,
          id: id,
          organization_id: form.getValues("organization_id"),
        },
      });

      if (!data.ok) {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckName = useCallback(debounce(checkNameExists, 500), []);

  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={""}
      render={({ field }) => (
        <FormItem className="relative w-full">
          <FormLabel>Nome</FormLabel>
          <div className="relative">
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
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

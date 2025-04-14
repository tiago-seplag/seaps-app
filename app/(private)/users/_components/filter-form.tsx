"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const filterSchema = z.object({
  name: z.string().optional(),
});

export function DataFilterForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: searchParams.get("name") || "",
    },
  });

  const handleClearSearch = () => {
    form.reset({
      name: "",
    });
    replace(pathname);
  };

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
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome</FormLabel>
              <Input
                {...field}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2 self-end justify-self-start">
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

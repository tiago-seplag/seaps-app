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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createItem } from "@/app/actions/create-item";
import { Item } from "@prisma/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
});

export function CreateItemForm({ item }: { level?: string; item?: Item }) {
  const { id } = useParams();
  const router = useRouter();

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createItem({
      ...values,
      checklist_id: id?.toString(),
      property_id: searchParams.get("property_id")!,
      level: item ? Number(item.level + 1) : undefined,
    }).then(() => router.back());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome da Etapa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Gerenciamento de Riscos e Comunicação..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

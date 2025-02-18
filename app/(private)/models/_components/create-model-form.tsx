"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";

const formSchema = z.object({
  name: z
    .string({
      message: "Insira o nome do Modelo",
    })
    .min(1, { message: "Insira o nome do Item" }),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Insira o nome do Item" }),
      }),
    )
    .min(1),
});

export function CreateModelForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (`1` === values.name) {
      router.back();
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  console.log(form.formState.errors.items);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-lg flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Modelo</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Descrição</FormLabel>
              <Textarea {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => {
            return (
              <div
                key={index}
                className="relative flex w-full gap-4 rounded border border-dashed p-2"
              >
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Item</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="icon"
                  className="absolute -right-5 -top-5 h-8 w-8 rounded-full"
                  onClick={() => {
                    form.clearErrors();
                    if (remove) remove(index);
                  }}
                  variant="destructive"
                >
                  <Trash width={16} />
                </Button>
              </div>
            );
          })}
          {form.formState.errors.items?.root && (
            <FormMessage>
              {form.formState.errors.items?.root.message}
            </FormMessage>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="col-span-2 w-full border-dashed"
          onClick={() => append({ name: "" })}
        >
          Adicionar Item
        </Button>
        <Button className="self-end" type="submit">
          Criar
        </Button>
      </form>
    </Form>
  );
}

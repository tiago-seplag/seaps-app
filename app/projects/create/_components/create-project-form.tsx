"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProject } from "@/app/actions/create-project";
import { Trash } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  organization_id: z.string().optional(),
  steps: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
});

export function ProjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined as unknown as string,
      steps: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    createProject(values);
  }

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <h2>Criar Projeto</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Projeto</FormLabel>
                <FormControl>
                  <Input placeholder="projeto de automação..." {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="relative flex w-full gap-4 rounded border border-dashed p-2"
              >
                <FormField
                  control={form.control}
                  name={`steps.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da etapa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="insira o nome da etapa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="icon"
                  className="absolute -right-5 -top-5 h-8 w-8 rounded-full"
                  onClick={() => remove(index)}
                  variant="destructive"
                >
                  <Trash width={16} />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            className="col-span-2 w-full border-dashed"
            onClick={() =>
              append({
                name: undefined as unknown as string,
              })
            }
          >
            Adicionar Etapa
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

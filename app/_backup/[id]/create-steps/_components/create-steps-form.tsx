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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStep } from "@/app/actions/create-item";
import { Step } from "@prisma/client";

const formSchema = z.object({
  name: z.string(),
  delivery: z.string(),
  duration: z.number(),
  usts: z.number(),
});

export function StepsForm({
  projectId,
  step,
}: {
  projectId: string;
  level?: string;
  step?: Step;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery: step ? String(step.delivery) : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createStep({
      ...values,
      project_id: projectId,
      step_id: step?.id,
      level: step ? Number(step.level + 1) : undefined,
    });
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
          <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Previsão de entrega</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Período do item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                      <SelectItem key={item + "periodo"} value={String(item)}>
                        {item}º Período
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
            name="duration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Duração</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    placeholder="Duração da Etapa"
                    type="number"
                    inputMode="numeric"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usts"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>UST{"'"}s</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    min={1}
                    placeholder="Qualtidade de UST"
                    type="number"
                    inputMode="numeric"
                    onChange={(e) => field.onChange(Number(e.target.value))}
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

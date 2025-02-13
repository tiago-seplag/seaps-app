/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStep } from "@/app/actions/create-item";
import { Step } from "@prisma/client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string(),
  organization_id: z.string(),
  steps: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function StepsForm({
  projectId,
}: {
  projectId: string;
  level?: string;
  step?: Step;
  steps?: any[];
}) {
  const [organizations, setOrganizations] = useState([]);
  const [steps, setSteps] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      steps: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createStep({
      ...values,
      project_id: projectId,
    });
  }

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
    fetch("/api/projects/" + projectId)
      .then((response) => response.json())
      .then((data) => setSteps(data));
  }, [projectId]);

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
            name="organization_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Previsão de entrega</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Período do item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations.map((item: any) => (
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
        </div>
        <FormField
          control={form.control}
          name="steps"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {steps.map((item: any) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="steps"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

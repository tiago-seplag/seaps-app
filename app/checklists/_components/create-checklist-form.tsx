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
import { useEffect, useState } from "react";
import { Organization, Property } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createChecklist } from "@/app/actions/create-checklist";

const formSchema = z.object({
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  property_id: z.string({
    message: "Selecione o Imóvel",
  }),
});

export function CreateCheckListForm() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: undefined as unknown as string,
    },
  });
  const [organization_id] = form.watch(["organization_id"]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  useEffect(() => {
    fetch("/api/organizations/" + organization_id + "/properties")
      .then((response) => response.json())
      .then((data) => setProperties(data));
  }, [organization_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createChecklist(values).then(() => router.replace('/'));
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="organization_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Orgão</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Período do item" />
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
            name="property_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imóvel</FormLabel>
                <div className="flex w-full items-center gap-2">
                  <Select
                    onValueChange={field.onChange}
                    disabled={!form.getValues("organization_id")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Período do item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
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
                        "/organizations/" +
                        form.getValues("organization_id") +
                        "/properties/create",
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

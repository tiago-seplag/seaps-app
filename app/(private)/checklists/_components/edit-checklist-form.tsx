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
import { Checklist, Model, Organization, Property, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  model_id: z.string({
    message: "Selecione um modelo de checklist",
  }),
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  property_id: z.string({
    message: "Selecione o Imóvel",
  }),
  user_id: z.string({
    message: "Selecione o Responsável pelo Checklist",
  }),
});

export function EditCheckListForm({
  checklist,
}: {
  checklist: {
    property: {
      organization_id: string;
    };
  } & Checklist;
}) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: checklist.property.organization_id,
      property_id: checklist.property_id,
      model_id: checklist.model_id,
      user_id: checklist.user_id || "",
    },
  });
  const [organization_id] = form.watch(["organization_id", "model_id"]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
    fetch("/api/models")
      .then((response) => response.json())
      .then((data) => setModels(data));
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (organization_id) {
      fetch("/api/organizations/" + organization_id + "/properties")
        .then((response) => response.json())
        .then((data) => setProperties(data));
    }
  }, [organization_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return axios
      .put("/api/checklists/" + checklist.id, values)
      .then(() => router.replace("/checklists"))
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-lg flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="model_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Modelo</FormLabel>
              <Select
                disabled
                defaultValue={checklist.model_id}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Modelo do checklist" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models.map((item) => (
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
          name="organization_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Orgão</FormLabel>
              <Select
                defaultValue={checklist.property.organization_id}
                disabled
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
          name="property_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imóvel</FormLabel>
              <div className="flex w-full items-center gap-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={checklist.property_id}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o imóvel do Orgão" />
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
                  disabled
                  variant={"default"}
                  onClick={() => {
                    router.push(
                      "/properties/create?organization_id=" +
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
          name="user_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Responsável</FormLabel>
              <Select
                defaultValue={checklist.user_id || ""}
                onValueChange={field.onChange}
                disabled={checklist.status == "CLOSED"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Responsável pelo checklis" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((item) => (
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
        <Button
          type="submit"
          disabled={checklist.status == "CLOSED"}
          className="self-end"
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}

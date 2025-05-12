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
import { Model, Organization, Property, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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

type ModelResponse = Model & {
  modelItems: ({
    item: {
      name: string;
    };
  } & {
    id: string;
    created_at: Date;
    item_id: string;
    model_id: string;
    order: number;
  })[];
};

export function CreateCheckListForm() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [model, setModel] = useState<ModelResponse>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: undefined as unknown as string,
    },
  });
  const [organization_id, model_id] = form.watch([
    "organization_id",
    "model_id",
  ]);

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

  useEffect(() => {
    if (model_id) {
      fetch("/api/models/" + model_id)
        .then((response) => response.json())
        .then((data) => setModel(data));
    }
  }, [model_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return axios
      .post("/api/checklists/", values)
      .then(() => router.replace("/checklists"))
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8 sm:flex-row">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="model_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Modelo</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Modelo do checklist" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models?.map((item) => (
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
                <Select onValueChange={field.onChange}>
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
                    disabled={!form.getValues("organization_id")}
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
                    disabled={!form.getValues("organization_id")}
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
                <FormLabel>Responsável pelo Checklist</FormLabel>
                <Select onValueChange={field.onChange}>
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
          <Button type="submit" className="self-end">
            Criar
          </Button>
        </form>
        <FormItem className="w-full">
          <FormLabel>Preview do modelo</FormLabel>
          {model &&
            model.modelItems?.map((field, index) => {
              return (
                <div
                  key={index}
                  className="w-full rounded border border-dashed p-2"
                >
                  <FormItem className="w-full">
                    <FormLabel>{field.item.name}</FormLabel>
                    <RadioGroup className="flex w-full" disabled>
                      <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-red-300 px-1 py-2 dark:bg-red-800">
                        <RadioGroupItem value="0" id={"0"} />
                        <Label htmlFor={"0"}>Ruim</Label>
                      </div>
                      <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-yellow-300 px-1 py-2 dark:bg-yellow-800">
                        <RadioGroupItem value="1" id={"1"} />
                        <Label htmlFor={"1"}>Regular</Label>
                      </div>
                      <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-green-300 px-1 py-2 dark:bg-green-800">
                        <RadioGroupItem value="2" id={"2"} />
                        <Label htmlFor={"2"}>Bom</Label>
                      </div>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            })}
        </FormItem>
      </div>
    </Form>
  );
}

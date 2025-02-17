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
import { useParams, useRouter, } from "next/navigation";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  name: z.string({
    message: "Insira o nome do imóvel.",
  }),
});


export function CreateItemForm({ item, }: { item?: Item, }) {
  const { id } = useParams<{ id: string[]; }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    },
  });

  console.log(item)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createItem({
      ...values,
      checklist_id: id[0],
      item_id: item ? item.id : undefined,
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
                <FormLabel>Nome do Item</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o nome do item..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
        <DialogFooter className="mt-4 flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button
              onClick={() => form.reset()}
              type="button"
              variant="destructive"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

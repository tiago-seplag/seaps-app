"use client";

import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { useParams, useRouter } from "next/navigation";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string({
    message: "Insira o nome do imóvel.",
  }),
});

export const CreateItemButton = () => {
  const modal = useModal();

  const { id, itemId } = useParams<{ id: string; itemId?: string[] }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createItem({
      ...values,
      checklist_id: id,
      item_id: itemId && itemId.length > 0 ? itemId[0] : undefined,
    }).then(() => {
      router.refresh();
      modal.hide();
    });
  }

  return (
    <>
      <Button onClick={modal.show}>
        <Plus />
        Adicionar Item
      </Button>
      <Dialog onOpenChange={modal.toggle} open={modal.visible}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nome do Item</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="mt-8 flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    onClick={() => form.reset()}
                    type="button"
                    variant="destructive"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

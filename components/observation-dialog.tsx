import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { $Enums, ChecklistItems } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ObservationDialogProps extends DialogProps {
  status: $Enums.STATUS;
  item: ChecklistItems & {
    item: {
      name: string;
    };
  };
}

const formSchema = z.object({
  observation: z.string({ message: "Insira uma descrição" }).max(255),
});

export function ObservationDialog({ item, ...props }: ObservationDialogProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observation: item.observation || undefined,
    },
  });

  useEffect(() => {
    setLoading(false);
  }, [props.open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await fetch(`/api/checklist-item/` + item.id, {
      body: JSON.stringify(values),
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then(() => {
        if (props.onOpenChange) props.onOpenChange(false);
        router.refresh();
      })
      .catch(() => toast.error("Opa! Algo deu errado!"))
      .finally(() => setLoading(false));
  }

  const CHECKLIST_IS_CLOSED = props.status === "CLOSED";

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar observação ao item</DialogTitle>
          <DialogDescription>{item.item.name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={255}
                      className="min-h-32"
                      autoCapitalize="characters"
                      placeholder="insira a observação do item"
                      disabled={loading || CHECKLIST_IS_CLOSED}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Observerção do item se necessária.
                    </FormDescription>
                    <span className="text-xs">
                      {field.value?.length || 0}/255
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button
                  onClick={() => form.reset()}
                  disabled={loading}
                  type="button"
                  variant="destructive"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button disabled={loading || CHECKLIST_IS_CLOSED} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

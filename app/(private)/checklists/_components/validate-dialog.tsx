import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ValidateDialogProps extends DialogProps {
  loading?: boolean;
  onSubmit: (values: { observation: string }) => Promise<void> | void;
}

export function ValidateDialog({
  onSubmit,
  loading,
  ...props
}: ValidateDialogProps) {
  const form = useForm();

  const handleSubmit = async () => {
    const values = form.getValues();
    await onSubmit({ observation: values.observation });
    form.reset();
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Deseja adicionar alguma observação ao checklist?
          </DialogTitle>
          <Form {...form}>
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Descrição</FormLabel>
                  <Textarea {...field} />
                </FormItem>
              )}
            />
          </Form>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-center md:gap-0">
          <DialogClose asChild>
            <Button disabled={loading} type="button" variant="destructive">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            Confimar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

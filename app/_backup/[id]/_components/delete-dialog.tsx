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
import { Step } from "@prisma/client";

interface DeleteDialogProps extends DialogProps {
  unit: Step;
  item?: string;
}

export function DeleteDialog({ unit, item, ...props }: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [props.open]);

  async function onSubmit() {
    setLoading(true);
    if (props.onOpenChange) props.onOpenChange(false);
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deletar Item</DialogTitle>
          <DialogDescription className={`${loading ? "animate-pulse" : ""}`}>
            Desja realmente deletar esse Item?
          </DialogDescription>
        </DialogHeader>
        <DialogDescription
          className={`${
            loading ? "animate-pulse" : ""
          } text-md pl-2 font-semibold text-foreground`}
        >
          Item: `{item}`<br />
          Nome: `{unit.name}`<br />
          Descrição: `{unit.delivery}`<br />
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={loading} type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={onSubmit}
            type="submit"
            variant={"destructive"}
          >
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChecklistItems } from "@prisma/client";

import { CreateItemForm } from "./create-item-form";

interface DeleteDialogProps extends DialogProps {
  item: ChecklistItems & {
    item: {
      name: string;
    };
  };
}


export function CreateItemDialog({ item, ...props }: DeleteDialogProps) {

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item</DialogTitle>
          <DialogDescription>{item.item.name}</DialogDescription>
        </DialogHeader>
        <CreateItemForm />
      </DialogContent>
    </Dialog>
  );
}

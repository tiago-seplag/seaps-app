"use client";

import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChecklistItemImages, ChecklistItems, Item } from "@prisma/client";
import EmblaCarousel from "./carousel/embla-carousel";

interface ObservationDialogProps extends DialogProps {
  item: ChecklistItems & {
    item: Pick<Item, "name">;
    images: ChecklistItemImages[];
  };
}

export function ImageDialog({ ...props }: ObservationDialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader hidden>
        <DialogTitle hidden>Imagens</DialogTitle>
        <DialogDescription hidden>Imagens</DialogDescription>
      </DialogHeader>
      <DialogContent
        className="w-full border-none py-4 shadow-none"
        aria-describedby="content"
      >
        <EmblaCarousel slides={props.item.images} options={{}} />
      </DialogContent>
    </Dialog>
  );
}

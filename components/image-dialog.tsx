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
import { useEffect, useState } from "react";
import Loading from "@/app/(private)/loading";

interface ObservationDialogProps extends DialogProps {
  item: any & {
    item: Pick<Item, "name">;
  };
}

export function ImageDialog({ item, ...props }: ObservationDialogProps) {
  const [images, setImages] = useState<ChecklistItemImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.open) {
      fetch("/api/checklists/" + item.checklist_id + "/items/" + item.id)
        .then((response) => response.json())
        .then((data) => setImages(data.images))
        .finally(() => setLoading(false));
    }
  }, [item.checklist_id, item.id, props.open]);

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
        {loading ? <Loading /> : <EmblaCarousel slides={images} options={{}} />}
      </DialogContent>
    </Dialog>
  );
}

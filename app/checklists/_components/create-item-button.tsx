"use client";

import { Item } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateItemForm } from "./create-item-form";
import { Plus } from "lucide-react";

export const CreateItemButton = ({ item }: { item?: Item }) => {
  const modal = useModal();

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
            <DialogDescription>item</DialogDescription>
          </DialogHeader>
          <CreateItemForm item={item} />
        </DialogContent>
      </Dialog>
    </>
  );
};

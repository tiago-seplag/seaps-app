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
import { $Enums, ChecklistItemImages } from "@prisma/client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteDialogProps extends DialogProps {
  image: ChecklistItemImages;
  status: $Enums.STATUS;
}

export function DeleteDialog({ image, ...props }: DeleteDialogProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, [props.open]);

  const CHECKLIST_IS_CLOSED = props.status === "CLOSED";

  async function onSubmit() {
    setLoading(true);

    await fetch(
      "/api/checklist-item/" + image.checklist_item_id + "/images/" + image.id,
      {
        method: "DELETE",
      },
    )
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

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Você tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente essa
            imagem.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-center gap-2">
          <DialogClose asChild>
            <Button disabled={loading} type="button" variant="destructive">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={CHECKLIST_IS_CLOSED || loading}
          >
            Confimar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

interface ReOpenDialogProps extends DialogProps {
  loading?: boolean;
  onSubmit: () => Promise<void> | void;
}

export function ReOpenDialog({
  onSubmit,
  loading,
  ...props
}: ReOpenDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deseja reabrir o checklist?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O responsável pelo checklist deverá
            finalizar novamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-center md:gap-0">
          <DialogClose asChild>
            <Button disabled={loading} type="button" variant="destructive">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit} disabled={loading}>
            Confimar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Checklist } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/user-context";

export const FinishButton = ({ checklist }: { checklist: Checklist }) => {
  const { user } = useUser();

  const router = useRouter();

  const handleFInishChecklist = () => {
    axios
      .put("/api/checklists/" + checklist.id + "/finish")
      .then(() => {
        toast.success("Checklist finalizado e assinado.");
        router.refresh();
      })
      .catch((e) => {
        if (e.response.data.messages?.length > 0) {
          e.response.data.messages.map((msg: string) => toast.error(msg));
        } else if (e.response.data.message) {
          toast.error(e.response.data.message);
        }
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full self-center"
          disabled={
            user?.id !== checklist.user_id || checklist.status !== "OPEN"
          }
        >
          Finalizar Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deseja finalizar o checklist?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-center space-x-1 md:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleFInishChecklist}>
            Confimar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

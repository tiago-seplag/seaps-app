"use client";

import { Button } from "@/components/ui/button";
import { Checklist } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const FinishButton = ({ checklist }: { checklist: Checklist }) => {
  const router = useRouter();

  const handleFInishChecklist = () => {
    axios
      .put("/api/checklists/" + checklist.id + "/finish")
      .then(() => {
        toast.success("Chcklist finalizado e assinado.");
        router.refresh();
      })
      .catch((e) => {
        if (e.response.data.message) {
          toast.error(e.response.data.message);
        }
      });
  };

  return (
    <Button
      className="self-center"
      onClick={handleFInishChecklist}
      disabled={checklist.status !== "OPEN"}
    >
      Finalizar Checklist
    </Button>
  );
};

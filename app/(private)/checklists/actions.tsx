"use client";

import axios from "axios";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { ChevronRight, Ellipsis, Pen, Printer, Undo } from "lucide-react";
import { useState } from "react";
import { Column } from "./columns";

import { toast } from "sonner";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { ReOpenDialog } from "@/components/reopen-dialog";
import { useModal } from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Actions = ({ row }: { row: Row<Column> }) => {
  const { user } = useUser();
  const router = useRouter();
  const reopenDialog = useModal();

  const [loading, setLoading] = useState(false);

  const handleGetReport = () => {
    toast.promise(
      axios.get("/api/reports/" + row.original.id, {
        responseType: "blob",
      }),
      {
        loading: "Caregando Relatório...",
        success: (data) => {
          const blob = new Blob([data.data], { type: "text/html" });
          const _url = window.URL.createObjectURL(blob);
          if (_url) {
            const a = document.createElement("a");
            a.href = _url;
            a.download = `${row.original.sid.replace("/", "_")}.pdf`;
            a.click();
            window.URL.revokeObjectURL(_url);
          }
          return `Relatório gerado com sucesso`;
        },
        error: "Erro ao gerar relatório",
      },
    );
  };

  const handleReopenChecklist = () => {
    setLoading(true);
    axios
      .post("/api/checklists/" + row.original.id + "/re-open")
      .then(() => {
        toast.success(`Checklist ${row.original.id} reaberto!`);
        router.refresh();
        reopenDialog.hide();
      })
      .catch(() => toast.error("Erro ao reabrir o checjlist"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ReOpenDialog
        onSubmit={handleReopenChecklist}
        onOpenChange={reopenDialog.toggle}
        open={reopenDialog.visible}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} className="h-7 flex-1">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>ID: {row.original.sid}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/checklists/" + row.original.id + "/items"}>
                <ChevronRight size={16} />
                Visualizar
              </Link>
            </DropdownMenuItem>
            {user?.role !== "EVALUATOR" && (
              <>
                <DropdownMenuItem
                  disabled={row.original.status === "CLOSED"}
                  asChild
                >
                  <Link href={"/checklists/" + row.original.id + "/edit"}>
                    <Pen size={16} />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={loading || row.original.status === "OPEN"}
                  onClick={() => reopenDialog.show()}
                >
                  <Undo size={16} />
                  Reabrir
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              disabled={row.original.status === "OPEN" || loading}
              onClick={handleGetReport}
            >
              <Printer size={16} />
              Relatório
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

"use client";
import { DataTable } from "@/components/data-table";
import { ScoreBadge } from "@/components/score-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useChecklist } from "@/contexts/checklist-context";
import { useModal } from "@/hooks/use-modal";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ValidateDialog } from "../../_components/validate-dialog";

export function ValidatePage() {
  const { checklist, checklistItems } = useChecklist();
  const validateModal = useModal();

  if (!checklist) {
    return null;
  }

  const handleValidateItem = async (itemId: string, value: string) => {
    await api.put(
      `/api/v1/checklists/${checklist?.id}/items/${itemId}/validate`,
      {
        is_valid: value === "true",
      },
    );
  };

  async function handleValidateChecklist({
    observation,
  }: {
    observation: string;
  }) {
    await api
      .put(`/api/v1/checklists/${checklist?.id}/validate`, {
        observation,
      })
      .then(() => validateModal.toggle(false));
  }

  return (
    <>
      <ValidateDialog
        onSubmit={handleValidateChecklist}
        onOpenChange={validateModal.toggle}
        open={validateModal.visible}
      />
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Nome",
            accessorFn(row) {
              return row.item.name;
            },
          },
          {
            accessorKey: "status",
            header: "Status",
            cell({ row }) {
              return <ScoreBadge status={String(row.original.score)} />;
            },
          },
          {
            accessorKey: "image",
            header: "Imagens",
            cell({}) {
              return (
                <Button variant="default" className="p-2" size="sm">
                  Imagens
                </Button>
              );
            },
          },
          {
            accessorKey: "is_valid",
            header: "",
            cell({ row }) {
              return (
                <RadioGroup
                  disabled={checklist.status === "OPEN"}
                  className={cn("flex")}
                  onValueChange={(e) => handleValidateItem(row.original.id, e)}
                  defaultValue={String(row.original.is_valid)}
                >
                  <div className="flex w-52 flex-col items-center justify-center gap-2 rounded bg-green-300 px-1 py-3 dark:bg-green-800 md:flex-row">
                    <RadioGroupItem value="true" id={row.original.id + `2`} />
                    <Label htmlFor={row.original.id + `2`}>Aprovado</Label>
                  </div>
                  <div className="flex w-52 flex-col items-center justify-center gap-2 rounded bg-red-300 px-1 py-3 dark:bg-red-800 md:flex-row">
                    <RadioGroupItem value="false" id={row.original.id + `1`} />
                    <Label htmlFor={row.original.id + `1`}>Reprovado</Label>
                  </div>
                </RadioGroup>
              );
            },
          },
        ]}
        data={checklistItems || []}
      />
      <div className="flex justify-end">
        <Button
          disabled={checklist.status === "OPEN"}
          className="mt-4"
          onClick={() => validateModal.toggle(true)}
        >
          Validar Checklist
        </Button>
      </div>
    </>
  );
}

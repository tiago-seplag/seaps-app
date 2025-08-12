"use client";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useChecklist } from "@/contexts/checklist-context";

export function ValidatePage() {
  const { checklist, checklistItems } = useChecklist();

  if (!checklist) {
    return null;
  }

  return (
    <>
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
              return <StatusBadge status={String(row.original.score)} />;
            },
          },
          {
            accessorKey: "comments",
            header: "",
            cell({ row }) {
              return (
                <RadioGroup
                  className="grid w-full grid-cols-3"
                  defaultValue={String(row.original.is_valid)}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-green-300 px-1 py-3 dark:bg-green-800 md:flex-row">
                    <RadioGroupItem value="true" id={row.original.id + `2`} />
                    <Label htmlFor={row.original.id + `2`}>Aprovado</Label>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-red-300 px-1 py-3 dark:bg-red-800 md:flex-row">
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
    </>
  );
}

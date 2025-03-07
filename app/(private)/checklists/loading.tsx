import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cheklists</h2>
        </div>
        <div className="self-end">
          <Button disabled>
            <Plus />
            Criar Checklist
          </Button>
        </div>
      </div>

      <DataTableSkeleton columns={columns} />
    </div>
  );
}

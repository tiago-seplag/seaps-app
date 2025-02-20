"use client";

import { Model } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
      return (
        <span title={row.original.id}>
          {row.original.id.slice(0, 8) + "..."}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return format(new Date(row.created_at), "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell({}) {
      return (
        <div className="flex gap-1">
          {/* <Button variant="outline" className="h-6 w-6 p-2" asChild>
            <Link href={"/checklists/" + row.original.id + "/items"}>
              <ChevronRight size={16} />
            </Link>
          </Button> */}
        </div>
      );
    },
  },
];

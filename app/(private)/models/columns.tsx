"use client";

import { Button } from "@/components/ui/button";
import { Model } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight, Pen, Trash } from "lucide-react";
import Link from "next/link";

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
    cell({ row }) {
      return (
        <div className="flex gap-1">
          <Button variant="outline" className="h-6 w-6 p-2" asChild>
            <Link href={"/models/" + row.original.id}>
              <ChevronRight size={16} />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-2" asChild>
            <Link href={"/models/" + row.original.id + "/edit"}>
              <Pen size={16} />
            </Link>
          </Button>
          <Button variant="destructive" className="h-6 w-6 p-2">
            <Trash size={16} />
          </Button>
        </div>
      );
    },
  },
];

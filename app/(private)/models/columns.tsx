"use client";

import { Button } from "@/components/ui/button";
import { Model } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight, Pen } from "lucide-react";
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
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return format(new Date(row.created_at), "dd/MM/yyyy");
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell({ row }) {
      return (
        <div className="flex gap-1">
          <Button variant="green" className="h-6 w-6 p-2" asChild>
            <Link href={"/models/" + row.original.id}>
              <ChevronRight size={16} />
            </Link>
          </Button>
          <Button variant="yellow" className="h-6 w-6 p-2" asChild>
            <Link href={"/models/" + row.original.id + "/edit"}>
              <Pen size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

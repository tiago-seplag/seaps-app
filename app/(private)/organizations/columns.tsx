"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Landmark, Users } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<
  {
    _count: {
      properties: number;
    };
  } & {
    id: string;
    name: string;
  }
>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
      return <span title={row.original.id}>{row.original.id}</span>;
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell font-mono",
      size: 100,
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "_count",
    header: "Imóveis",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell max-w-40",
    },
    accessorFn: (row) => row._count.properties,
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell({ row }) {
      return (
        <div className="flex gap-1">
          <Button
            title="Responsáveis"
            variant="green"
            className="h-6 w-6 p-2"
            asChild
          >
            <Link href={"/organizations/" + row.original.id + "/responsible"}>
              <Users size={16} />
            </Link>
          </Button>
          <Button title="Imóveis" className="h-6 w-6 p-2" asChild>
            <Link href={"/organizations/" + row.original.id + "/properties"}>
              <Landmark size={16} />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-2" asChild>
            <Link href={"/checklists/?organization=" + row.original.id}>
              <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFirstAndLastName } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight, Pen } from "lucide-react";
// import { Pen, Printer, Trash } from "lucide-react";
import Link from "next/link";

const ENUM = {
  OPEN: {
    label: "ABERTO",
    style: "border-green-800 bg-green-500 hover:bg-green-500/80",
  },
  CLOSED: {
    label: "FECHADO",
    style: "border-red-800 bg-red-500 hover:bg-red-500/80",
  },
};

type Column = {
  user: {
    name: string;
  } | null;
  property: {
    name: string;
    address: string | null;
    organization: {
      name: string;
    };
  };
} & {
  id: string;
  sid: string;
  status: $Enums.Status;
  property_id: string;
  user_id: string | null;
  person_id: string | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "sid",
    header: "ID",
    cell({ row }) {
      return (
        <Link
          href={"/checklists/" + row.original.id + "/items"}
          className="text-sky-400 hover:text-sky-700"
        >
          {row.original.sid}
        </Link>
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "organization",
    header: "Orgão",
    accessorFn(row) {
      return row.property.organization.name;
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "property",
    header: "Imóvel",
    accessorFn(row) {
      return row.property.name;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      return (
        <Badge className={ENUM[row.original.status].style}>
          {ENUM[row.original.status].label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Responsável",
    accessorFn(row) {
      return row.user?.name ? getFirstAndLastName(row.user?.name) : "--";
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
    accessorKey: "finished_at",
    header: "Finalizado em",
    accessorFn(row) {
      return row.finished_at
        ? format(new Date(row.finished_at), "dd/MM/yyyy")
        : "--";
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
            <Link href={"/checklists/" + row.original.id + "/items"}>
              <ChevronRight size={16} />
            </Link>
          </Button>
          <Button variant="yellow" className="h-6 w-6 p-2" asChild>
            <Link href={"/checklists/" + row.original.id + "/edit"}>
              <Pen size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

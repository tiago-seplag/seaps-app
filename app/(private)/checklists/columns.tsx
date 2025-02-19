"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { $Enums } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
// import { Pen, Printer, Trash } from "lucide-react";
import Link from "next/link";

const ENUM = {
  OPEN: {
    label: "ABERTO",
    style: "border-green-800 bg-green-500",
  },
  CLOSED: {
    label: "FECHADO",
    style: "border-red-800 bg-red-500",
  },
};

type Column = {
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
  },
  {
    accessorKey: "organization",
    header: "Orgão",
    accessorFn(row) {
      return row.property.organization.name;
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
            <Link href={"/checklists/" + row.original.id + "/items"}>
              <ChevronRight size={16} />
            </Link>
          </Button>
          {/* <Button variant="outline" className="h-6 w-6 p-2">
            <Pen size={16} />
          </Button>
          <Button variant="outline" className="h-6 w-6 p-2">
            <Printer size={16} />
          </Button>
          <Button variant="destructive" className="h-6 w-6 p-2">
            <Trash size={16} />
          </Button> */}
        </div>
      );
    },
  },
];

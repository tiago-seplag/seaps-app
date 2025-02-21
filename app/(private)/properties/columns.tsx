"use client";

import { ENUM_PROPERTY, PropertyBadge } from "@/components/property-badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight, Pen } from "lucide-react";
import Link from "next/link";

type Column = {
  id: string;
  created_at: Date;
  updated_at: Date;
  type: string;
  address: string | null;
  name: string;
  organization_id: string;
  location: string | null;
  organization: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<Column>[] = [
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
    accessorKey: "property",
    header: "Imóvel",
    accessorFn(row) {
      return row.name;
    },
  },
  {
    accessorKey: "organizationn",
    header: "Orgão",
    accessorFn(row) {
      return row.organization.name;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell({ row }) {
      return <PropertyBadge type={row.original.type as ENUM_PROPERTY} />;
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
          <Button variant="green" className="h-6 w-6 p-2">
            <ChevronRight size={16} />
          </Button>
          <Button variant="yellow" className="h-6 w-6 p-2" asChild>
            <Link href={"/properties/" + row.original.id + "/edit"}>
              <Pen size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

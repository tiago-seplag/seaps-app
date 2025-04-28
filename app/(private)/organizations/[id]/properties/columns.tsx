"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const ENUM = {
  OWN: {
    label: "PRÓPRIO",
    style: "border-green-800 bg-green-500",
  },
  RENTED: {
    label: "ALUGADO",
    style: "border-red-800 bg-red-500",
  },
  GRANT: {
    label: "CONCESSÃO",
    style: "border-red-800 bg-red-500",
  },
};

type ENUM_OPT = "GRANT" | "RENTED" | "OWN";

export const columns: ColumnDef<{
  id: string;
  name: string;
  organization_id: string;
  person_id: string | null;
  address: string | null;
  type: string;
  location: string | null;
  created_at: Date;
  updated_at: Date;
  person?: {
    id: string;
    name: string;
    organization_id: string;
    created_at: Date;
    updated_at: Date;
    role: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "property",
    header: "Imóvel",
    accessorFn(row) {
      return row.name;
    },
  },
  {
    accessorKey: "person",
    header: "Responsável",
    accessorFn(row) {
      return row.person?.name;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell({ row }) {
      return (
        <Badge className={""}>
          {ENUM[row.original.type as ENUM_OPT].label}
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
];

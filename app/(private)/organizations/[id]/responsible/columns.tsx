"use client";

import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Pen } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<{
  id: string;
  name: string;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
  email: string | null;
  phone: string | null;
  role: string | null;
}>[] = [
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
    header: "Responsável",
    accessorFn(row) {
      return row.name;
    },
  },
  {
    accessorKey: "role",
    header: "Cargo",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    accessorFn(row) {
      return formatPhone(row.phone || "");
    },
  },
  {
    accessorKey: "email",
    header: "Email",
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
          <Button variant="yellow" className="h-6 w-6 p-2" asChild>
            <Link href={"/responsible/" + row.original.id}>
              <Pen size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

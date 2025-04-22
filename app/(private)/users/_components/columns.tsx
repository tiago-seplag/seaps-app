"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Actions } from "./actions";
import { Badge } from "@/components/ui/badge";

export type Column = User;

export const columns: ColumnDef<Column>[] = [
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
    accessorKey: "role",
    header: "Perfil",
    cell({ row }) {
      return (
        <Badge>
          {row.original.role === "EVALUATOR"
            ? "AVALIADOR"
            : row.original.role === "SUPERVISOR"
              ? "SUPERVISOR"
              : "ADMINISTRADOR"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell max-w-40",
    },
  },
  {
    accessorKey: "is_active",
    header: "Ativo",
    cell({ row }) {
      return (
        <Badge variant={row.original.is_active ? "green" : "red"}>
          {row.original.is_active ? "ATIVO" : "DESATIVADO"}
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
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <Actions row={row} />,
  },
];

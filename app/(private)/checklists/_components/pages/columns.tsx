"use client";

import { Badge } from "@/components/ui/badge";
import { getFirstAndLastName } from "@/lib/utils";
import { Checklist } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Actions } from "./actions";

const CLASSIFICATION_ENUM = {
  0: {
    label: "RUIM",
    style: "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80",
  },
  1: {
    label: "REGULAR",
    style:
      "border-yellow-800 bg-yellow-200 text-yellow-900 hover:bg-yellow-200/80",
  },
  2: {
    label: "BOM",
    style: "border-green-800 bg-green-200 text-green-900 hover:bg-green-200/80",
  },
};

type CLASSIFICATION = 0 | 1 | 2;

export type Column = {
  user: {
    name: string;
  } | null;
  organization: {
    name: string;
  };
  property: {
    name: string;
  };
} & Checklist;

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "sid",
    header: "ID",
    cell({ row }) {
      return (
        <Link
          href={"/checklists/" + row.original.id + "/items"}
          className="font-mono text-sky-400 hover:text-sky-700"
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
      return row.organization.name;
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
      return <StatusBadge status={row.original.status!} />;
    },
  },
  {
    accessorKey: "classification",
    header: "Classificação",
    accessorFn(row) {
      return row.organization.name;
    },
    cell({ row }) {
      return CLASSIFICATION_ENUM[
        row.original.classification as CLASSIFICATION
      ] ? (
        <Badge
          className={
            CLASSIFICATION_ENUM[row.original.classification as CLASSIFICATION]
              .style
          }
        >
          {
            CLASSIFICATION_ENUM[row.original.classification as CLASSIFICATION]
              .label
          }
        </Badge>
      ) : (
        "--"
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "user",
    header: "Responsável",
    accessorFn(row) {
      return row.user?.name ? getFirstAndLastName(row.user?.name) : "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return format(new Date(row.created_at || ""), "dd/MM/yyyy");
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
    cell: ({ row }) => <Actions row={row} />,
  },
];

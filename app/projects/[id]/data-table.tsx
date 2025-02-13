"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Step } from "@prisma/client";
import { Column } from "./columns";
import { Button } from "@/components/ui/button";
import { Pen, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface DataTableProps<TValue> {
  columns: Step[];
  data: TValue[];
}

export function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "name",
        header: "Nome",
      },
      {
        accessorKey: "organization",
        header: "Orgão",
        accessorFn: (row) => (row.organization ? row.organization.name : "--"),
      },
      ...Column(columns),
      {
        accessorKey: "action",
        header: "",
        size: 100,
        cell({ row }) {
          return (
            <div className="flex w-fit gap-2">
              <Button variant="ghost" className="h-5 w-5 p-0">
                <Pen size={8} />
              </Button>
              <Button variant="ghost" className="h-5 w-5 p-0">
                <TrashIcon size={8} className="text-red-500" />
              </Button>
              {row.original.level > 1 ? null : (
                <Button
                  variant="ghost"
                  className="h-5 w-5 p-0"
                  disabled={row.original.level > 1}
                  asChild
                >
                  <Link
                    href={
                      row.original.project_id +
                      "/service/" +
                      row.original.id
                    }
                  >
                    <PlusIcon size={8} />
                  </Link>
                </Button>
              )}
              {/* <DeleteDialog
            item={idFormat(step.id)}
            onOpenChange={deleteDialog.toggle}
            open={deleteDialog.visible}
            unit={step.original}
          /> */}
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

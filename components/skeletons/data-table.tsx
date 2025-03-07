/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableSkeletonProps {
  columns: any[];
}

export function DataTableSkeleton({ columns }: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((header, index) => {
            return (
              <TableHead
                key={index}
                className={header.meta?.headerClassName}
                style={{
                  minWidth: header.size,
                  maxWidth: header.size,
                  width: header.size,
                }}
              >
                {header.header}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => {
              return (
                <TableCell
                  key={index}
                  className={column.meta?.cellClassName}
                  width={column.meta?.size ? column.meta.size : undefined}
                  style={{
                    minWidth: column.meta?.size,
                    maxWidth: column.meta?.size,
                    width: column.meta?.size,
                    height: "41px",
                  }}
                >
                  <div
                    className={cn(
                      "h-2/3 animate-pulse rounded-sm bg-muted-foreground/15",
                    )}
                  ></div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

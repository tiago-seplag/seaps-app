"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { ChevronRight, Pen } from "lucide-react";
import { Column } from "./columns";

export const Actions = ({ row }: { row: Row<Column> }) => {
  return (
    <div className={cn("flex gap-1")}>
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
};

"use client";

import axios from "axios";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { ChevronRight, Pen, Printer } from "lucide-react";
import { useState } from "react";
import { Column } from "./columns";

import { toast } from "sonner";

const MOBILE_BREAKPOINT = 768;

export const Actions = ({ row }: { row: Row<Column> }) => {
  const [loading, setLoading] = useState(false);

  const handleGetReport = () => {
    setLoading(true);
    axios
      .get("/api/reports/" + row.original.id, {
        responseType: "blob",
      })
      .then((value) => {
        const blob = new Blob([value.data], { type: "text/html" });
        const _url = window.URL.createObjectURL(blob);
        if (_url) {
          window
            .open(
              _url,
              "Axios data",
              window.innerWidth > MOBILE_BREAKPOINT
                ? "width=820,height=800"
                : "",
            )
            ?.focus();
        }
      })
      .catch(() => toast.error("Erro ao gerar relatório"))
      .finally(() => setLoading(false));
  };

  return (
    <div className={cn("flex gap-1", loading && "animate-pulse")}>
      <Button
        disabled={loading}
        variant="green"
        className="h-6 w-6 p-2"
        asChild
      >
        <Link href={"/checklists/" + row.original.id + "/items"}>
          <ChevronRight size={16} />
        </Link>
      </Button>
      <Button
        disabled={loading}
        variant="yellow"
        className="h-6 w-6 p-2"
        asChild
      >
        <Link href={"/checklists/" + row.original.id + "/edit"}>
          <Pen size={16} />
        </Link>
      </Button>
      <Button
        variant="zinc"
        className="h-6 w-6 p-2"
        disabled={row.original.status === "OPEN" || loading}
        onClick={handleGetReport}
      >
        <Printer size={16} />
      </Button>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { useAuth } from "@/contexts/auht-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataFilterForm } from "../filter-form";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { api } from "@/lib/axios";

export function Checklists() {
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const perPage = searchParams.get("per_page");

  const organization = searchParams.get("organization");
  const _user = searchParams.get("user");
  const status = searchParams.get("status");
  const property_name = searchParams.get("property_name");

  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>([]);

  useEffect(() => {
    api
      .get("/api/v1/checklists", {
        params: {
          page: page,
          per_page: perPage,
          organization,
          user: _user,
          status,
          property_name,
        },
      })
      .then(({ data }) => {
        setChecklists(data.data);
        setMeta(data.meta);
      })
      .finally(() => setLoading(false));
  }, [_user, organization, page, perPage, property_name, status]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
        </div>
        <div className="self-end">
          {user?.role !== "EVALUATOR" && (
            <Button asChild>
              <Link href={"checklists/create"}>
                <Plus />
                Criar Checklist
              </Link>
            </Button>
          )}
        </div>
      </div>
      <DataFilterForm />
      {loading ? (
        <DataTableSkeleton columns={columns} />
      ) : (
        <DataTable columns={columns} data={checklists} />
      )}
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}

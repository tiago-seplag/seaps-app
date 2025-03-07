/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";
import Link from "next/link";

export default async function Page(props: { searchParams: any }) {
  const total = await prisma.checklist.count();

  const searchParams = await props.searchParams;

  const params = new URLSearchParams(searchParams);

  const current_page = Number(params.get("page") || 1);
  const per_page = Number(params.get("per_page") || 10);

  const meta = generateMetaPagination(current_page, per_page, total);

  const checklists = await prisma.checklist.findMany({
    include: {
      property: {
        select: {
          name: true,
          address: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
    take: per_page,
    skip: (current_page - 1) * per_page,
  });

  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
          </div>
          <div className="self-end">
            <Button asChild>
              <Link href={"checklists/create"}>
                <Plus />
                Criar Checklist
              </Link>
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={checklists} />
        {meta.total > 10 && <Pagination meta={meta} />}
      </div>
    </Suspense>
  );
}

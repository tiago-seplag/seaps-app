import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { getChecklistsPaginated } from "@/models/checklist";
import { DataFilterForm } from "./_components/filter-form";
import Link from "next/link";

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, perPage, ...searchParams } = await props.searchParams;

  const { meta, data: checklists } = await getChecklistsPaginated(
    Number(page || 1),
    Number(perPage || 10),
    searchParams,
  ).then((response) => response.json());

  return (
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

      <DataFilterForm />
      <DataTable columns={columns} data={checklists} />
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}

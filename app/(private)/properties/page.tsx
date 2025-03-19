import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { getPropertiesPaginated } from "@/models/property";
import Link from "next/link";

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const { meta, data: properties } = await getPropertiesPaginated(
    Number(searchParams.page || 1),
    Number(searchParams.perPage || 10),
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Imóveis</h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={"properties/create"}>
              <Plus />
              Criar Imóvel
            </Link>
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={properties} />
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}

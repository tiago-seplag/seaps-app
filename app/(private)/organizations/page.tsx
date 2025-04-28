import { DataTable } from "@/components/data-table";
import { getOrganizationsPaginated } from "@/models/organization";
import { columns } from "./columns";
import { Pagination } from "@/components/pagination";

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const { meta, data: organizations } = await getOrganizationsPaginated(
    Number(searchParams.page || 1),
    Number(searchParams.perPage || 10),
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orgãos</h2>
        </div>
      </div>

      <DataTable columns={columns} data={organizations} />
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}

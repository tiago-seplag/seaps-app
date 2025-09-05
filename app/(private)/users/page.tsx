import { columns } from "./_components/columns";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { DataFilterForm } from "./_components/filter-form";
import { getUsersPaginated } from "@/models/user";
import { SearchParams } from "@/types/types";

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, perPage, ...searchParams } = await props.searchParams;

  const { meta, data: users } = await getUsersPaginated(
    Number(page || 1),
    Number(perPage || 10),
    searchParams,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        </div>
      </div>

      <DataFilterForm />
      <DataTable columns={columns} data={users} />
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}

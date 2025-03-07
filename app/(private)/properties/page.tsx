/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { cookies } from "next/headers";
import { Pagination } from "@/components/pagination";
import Link from "next/link";

export default async function Page(props: { searchParams: any }) {
  const searchParams = await props.searchParams;

  const cookie = await cookies();
  const params = new URLSearchParams(searchParams);

  const [properties, meta] = await fetch(
    "http://127.0.0.1:3000/api/properties?" + params.toString(),
    {
      headers: {
        Cookie: cookie.toString(),
      },
    },
  )
    .then((response) => response.json())
    .then((data) => data);

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

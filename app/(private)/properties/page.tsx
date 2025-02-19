import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
  const properties = await prisma.property.findMany({
    include: {
      organization: true,
    },
    orderBy: {
      name: "asc",
    },
  });

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
    </div>
  );
}

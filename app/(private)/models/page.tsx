import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import Link from "next/link";
import { DataTable } from "@/components/data-table";

export default async function Page() {
  const models = await prisma.model.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modelos</h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={"models/create"}>
              <Plus />
              Criar Modelo
            </Link>
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={models} />
    </div>
  );
}

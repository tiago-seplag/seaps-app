import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";

export default async function Page() {
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
  });

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

      <DataTable columns={columns} data={checklists} />
    </div>
  );
}

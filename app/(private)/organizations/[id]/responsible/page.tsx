import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

interface Params {
  params: Promise<{
    id: string;
    itemId?: string[];
  }>;
}

export default async function Page({ params }: Params) {
  const { id } = await params;

  const organization = await prisma.organization.findFirst({
    where: {
      id,
    },
    include: {
      persons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!organization) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Responsáveis - {organization.name}
          </h2>
        </div>
      </div>

      <DataTable columns={columns} data={organization.persons} />
    </div>
  );
}

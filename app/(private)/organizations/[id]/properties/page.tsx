import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";

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
      properties: {
        include: {
          person: true,
        },
      },
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
            {organization.name}
          </h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={"organizations/create"}>
              <Plus />
              Criar Imóvel
            </Link>
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={organization.properties} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      properties: true,
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

      <ul className="flex flex-col gap-y-2">
        {organization.properties.map((property) => (
          <li key={property.id}>
            <Link href={"properties/" + property.id}>{property.id}</Link> -{" "}
            {property.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

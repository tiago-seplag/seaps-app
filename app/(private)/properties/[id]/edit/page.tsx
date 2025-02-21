import { GoBack } from "@/components/go-back";
import { EditPropertyForm } from "./edit-property-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProperty({ params }: PageParams) {
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: {
      id,
    },
  });

  if (!property) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Editar Imóvel</h2>
      </div>
      <EditPropertyForm property={property} />
    </div>
  );
}

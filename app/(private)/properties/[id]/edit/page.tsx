import { GoBack } from "@/components/go-back";
import { EditPropertyForm } from "./edit-property-form";
import { notFound } from "next/navigation";
import property from "@/models/property";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProperty({ params }: PageParams) {
  const { id } = await params;

  const findedProperty = await property.findById(id);

  if (!findedProperty) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Editar Imóvel</h2>
      </div>
      <EditPropertyForm property={findedProperty} />
    </div>
  );
}

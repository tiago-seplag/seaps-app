import { GoBack } from "@/components/go-back";
import { CreatePropertyForm } from "./create-property-form";

type CreatePropertyProps = {
  params: {
    id: string;
  };
};

export default async function CreateProperty({ params }: CreatePropertyProps) {
  const { id } = await params;

  return (
    <div className="p-4">
      <div className="flex items-center">
        <GoBack />
        <h2>Criar Propriedade</h2>
      </div>
      <CreatePropertyForm organizationId={id} />
    </div>
  );
}

import { GoBack } from "@/components/go-back";
import { CreatePropertyForm } from "./create-property-form";

export default async function CreateProperty() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Criar Imóvel</h2>
      </div>
      <CreatePropertyForm />
    </div>
  );
}

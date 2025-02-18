import { GoBack } from "@/components/go-back";
import { CreateModelForm } from "../_components/create-model-form";

export default function CreateCheckList() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Criar Modelo</h2>
      </div>
      <CreateModelForm />
    </div>
  );
}

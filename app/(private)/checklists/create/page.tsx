import { GoBack } from "@/components/go-back";
import { CreateCheckListForm } from "../_components/create-checklist-form";

export default function CreateCheckList() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Criar Checklist</h2>
      </div>
      <CreateCheckListForm />
    </div>
  );
}

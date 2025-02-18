import { GoBack } from "@/components/go-back";
import { CreateCheckListForm } from "../_components/create-checklist-form";

export default function CreateCheckList() {
  return (
    <div>
      <div className="mb-4 flex items-center">
        <GoBack />
        <h2>Criar Checklist</h2>
      </div>
      <CreateCheckListForm />
    </div>
  );
}

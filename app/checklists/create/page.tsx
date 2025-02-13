import { GoBack } from "@/components/go-back";
import { CreateCheckListForm } from "../_components/create-checklist-form";

export default function CreateCheckList() {
  return (
    <div className="p-4">
      <div className="flex">
        <GoBack />
        <h2>Criar Checklist</h2>
      </div>
      <CreateCheckListForm />
    </div>
  );
}

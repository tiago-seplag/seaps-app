"use client";
import { ChecklistCard } from "@/components/checklist-card";
import { useChecklist } from "@/contexts/checklist-context";

export function ItemsPage() {
  const { checklist } = useChecklist();

  if (!checklist) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {checklist.checklistItems.map((checklistItem) => (
        <ChecklistCard
          status={checklist.status}
          key={checklistItem.id}
          checklistItem={checklistItem}
          propertyId={checklist.property_id}
        />
      ))}
    </div>
  );
}

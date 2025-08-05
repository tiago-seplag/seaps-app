"use client";

import { ChecklistImageCard } from "@/components/image-card";
import { ImageDialog } from "@/components/image-dialog";
import { UploadCard } from "@/components/upload-card";
import { useChecklist } from "@/contexts/checklist-context";
import { useModal } from "@/hooks/use-modal";
import { ChecklistItemImages, ChecklistItems, Item } from "@prisma/client";

export const Images = ({
  checklistItem,
}: {
  checklistItem: ChecklistItems & {
    item: Pick<Item, "name">;
    images: ChecklistItemImages[];
  };
}) => {
  const { checklist } = useChecklist();

  const imageDialog = useModal();

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {checklistItem.images.map((image) => (
          <ChecklistImageCard
            status={checklist!.status}
            key={image.id}
            checklistImage={checklistItem.image || undefined}
            image={image}
            onClick={imageDialog.show}
          />
        ))}

        {checklistItem.images.length < 10 && checklist?.status === "OPEN" && (
          <UploadCard
            maxFileCount={10 - checklistItem.images.length}
            status={checklist?.status}
            checklistItemId={checklistItem.id}
          />
        )}
      </div>
      <ImageDialog
        item={checklistItem}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
      />
    </>
  );
};

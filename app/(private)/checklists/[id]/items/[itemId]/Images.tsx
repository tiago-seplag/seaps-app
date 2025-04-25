"use client";

import { ChecklistImageCard } from "@/components/image-card";
import { ImageDialog } from "@/components/image-dialog";
import { UploadCard } from "@/components/upload-card";
import { useModal } from "@/hooks/use-modal";
import {
  Checklist,
  ChecklistItemImages,
  ChecklistItems,
  Item,
} from "@prisma/client";

export const Images = ({
  checklistItem,
}: {
  checklistItem: ChecklistItems & {
    item: Pick<Item, "name">;
    images: ChecklistItemImages[];
    checklist: Pick<Checklist, "status">;
  };
}) => {
  const imageDialog = useModal();

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {checklistItem.images.map((image) => (
          <ChecklistImageCard
            status={checklistItem.checklist.status}
            key={image.id}
            checklistImage={checklistItem.image || undefined}
            image={image}
            onClick={imageDialog.show}
          />
        ))}

        {checklistItem.images.length < 5 &&
          checklistItem.checklist.status === "OPEN" && (
            <UploadCard
              maxFileCount={5 - checklistItem.images.length}
              status={checklistItem.checklist.status}
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

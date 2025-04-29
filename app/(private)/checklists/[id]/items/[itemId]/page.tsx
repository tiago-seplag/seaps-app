import { notFound } from "next/navigation";
import { GoBack } from "@/components/go-back";
import { Images } from "./Images";
import { getChecklistItemById } from "@/models/checklist-item";

type ProjectPageProps = {
  params: Promise<{
    itemId: string;
  }>;
  searchParams: Promise<{
    item_id: string;
  }>;
};

export default async function Page({ params }: ProjectPageProps) {
  const { itemId } = await params;

  let checklistItem;

  try {
    checklistItem = await getChecklistItemById(itemId);
  } catch {
    checklistItem = null;
  }

  if (!checklistItem) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <GoBack />
            <h2
              className="line-clamp-1 break-words text-2xl font-bold"
              title={checklistItem.item.name}
            >
              {checklistItem.item.name}
            </h2>
          </div>
          <div>
            <p className="text-wrap">{checklistItem.observation}</p>
          </div>
        </div>
      </div>
      <Images checklistItem={checklistItem} />
    </div>
  );
}

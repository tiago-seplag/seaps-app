import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GoBack } from "@/components/go-back";
import { Suspense } from "react";
import { ChecklistImageCard } from "@/components/image-card";
import { UploadCard } from "@/components/upload-card";

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

  const checklistItem = await prisma.checklistItems.findUnique({
    where: { id: itemId },
    include: {
      item: true,
      images: true,
      checklist: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!checklistItem) {
    return notFound();
  }

  return (
    <Suspense fallback={<p>Loading feed...</p>}>
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {checklistItem.images.map((image) => (
            <ChecklistImageCard
              status={checklistItem.checklist.status}
              key={image.id}
              image={image}
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
      </div>
    </Suspense>
  );
}

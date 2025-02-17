import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/checklist-card";
import { GoBack } from "@/components/go-back";
import { CreateItemButton } from "@/app/checklists/_components/create-item-button";

type ProjectPageProps = {
  params: Promise<{
    id: string;
    itemId?: string[];
  }>;
  searchParams: Promise<{
    item_id: string;
  }>;
};

export default async function Page({ params }: ProjectPageProps) {
  const { id, itemId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const recursive = (level = 1): any => {
    if (level === 0) {
      return {
        include: {
          steps: true,
        },
      };
    }

    return {
      include: {
        steps: recursive(level - 1),
      },
    };
  };

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: {
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
      person: true,
      user: true,
      checklistItems: {
        include: {
          item: true,
        },
        where: {
          item: {
            level: itemId ? undefined : 0,
            item_id: !itemId ? undefined : itemId[itemId.length - 1],
          },
        },
      },
      _count: {
        select: {
          checklistItems: true,
        },
      },
    },
  });

  if (!checklist) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <div className="flex justify-between gap-2">
        <div className="flex items-center truncate">
          <GoBack />
          <h2
            className="truncate text-2xl font-bold tracking-tight"
            title={checklist.property.name}
          >
            {checklist.property.name}
          </h2>
        </div>
        <div className="flex gap-2 self-end">
          <CreateItemButton />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {checklist.checklistItems.map((checklistItem) => (
          <ChecklistCard
            key={checklistItem.id}
            checklistItem={checklistItem}
            propertyId={checklist.property_id}
          />
        ))}
      </div>
    </div>
  );
}

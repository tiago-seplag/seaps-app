import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/checklist-card";
import { GoBack } from "@/components/go-back";
import { ENUM_PROPERTY, PropertyBadge } from "@/components/property-badge";

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

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: {
        include: {
          person: true,
        },
      },
      person: true,
      user: true,
      checklistItems: {
        include: {
          item: true,
          images: true,
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
      <div className="flex items-center gap-3 truncate">
        <GoBack />
        <div>
          <h2
            className="flex items-center gap-2 truncate text-2xl font-bold tracking-tight"
            title={checklist.property.name}
          >
            {checklist.property.name}
            <PropertyBadge type={checklist.property.type as ENUM_PROPERTY} />
          </h2>
          <p>{checklist.property.address}</p>
          <p>
            {checklist.property.person?.name} -{" "}
            {checklist.property.person?.role || ""} -{" "}
            {checklist.property.person?.phone}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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

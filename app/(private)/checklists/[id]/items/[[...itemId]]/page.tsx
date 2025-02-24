import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/checklist-card";
import { GoBack } from "@/components/go-back";
import { ENUM_PROPERTY, PropertyBadge } from "@/components/property-badge";
import { cookies } from "next/headers";
import { FinishButton } from "../../../_components/finish-checklist-button";
import { format } from "date-fns";
import { getFirstAndLastName } from "@/lib/utils";

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
  const cookieStore = await cookies();

  const user = cookieStore.get("USER_DATA")?.value;

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
      <div className="flex justify-between">
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
        {checklist.status === "CLOSED" && checklist.finished_at ? (
          <div className="h-full">
            <p>
              Assinado por: {getFirstAndLastName(checklist.user?.name || "")}
            </p>
            <p>
              Data da finalização: {format(checklist.finished_at, "dd/MM/yyyy")}
            </p>
          </div>
        ) : (
          user &&
          JSON.parse(user).id === checklist.user_id && (
            <FinishButton checklist={checklist} />
          )
        )}
      </div>
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
    </div>
  );
}

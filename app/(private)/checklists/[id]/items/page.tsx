import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/checklist-card";
import { GoBack } from "@/components/go-back";
import { ENUM_PROPERTY, PropertyBadge } from "@/components/property-badge";
import { format } from "date-fns";
import { getFirstAndLastName } from "@/lib/utils";
import { Suspense } from "react";
import { FinishButton } from "../../_components/finish-checklist-button";
import { getUser } from "@/lib/dal";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    item_id: string;
  }>;
};

export default async function Page({ params }: ProjectPageProps) {
  const { id } = await params;

  const user = await getUser();

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: true,
      person: true,
      user: true,
      checklistItems: {
        include: {
          item: true,
          images: true,
        },
        orderBy: {
          item: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!checklist) {
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
                title={checklist.property.name}
              >
                {checklist.property.name}
              </h2>
              <PropertyBadge
                className="h-fit"
                type={checklist.property.type as ENUM_PROPERTY}
              />
            </div>
            <div>
              <p className="line-clamp-2 text-wrap text-sm text-muted-foreground">
                {checklist.property.address}
              </p>
            </div>
            <div>
              <p className="text-wrap">
                {`${checklist.person?.name} - ${checklist.person?.role || ""} - ${checklist.person?.phone}`}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-end">
            {checklist.status === "CLOSED" && checklist.finished_at ? (
              <div className="w-full text-nowrap">
                <p>
                  <strong> Assinado por: </strong>
                  {getFirstAndLastName(checklist.user?.name || "")}
                </p>
                <p>
                  <strong>Data da finalização: </strong>
                  {format(checklist.finished_at, "dd/MM/yyyy")}
                </p>
              </div>
            ) : (
              user &&
              user.id === checklist.user_id && (
                <FinishButton checklist={checklist} />
              )
            )}
          </div>
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
    </Suspense>
  );
}

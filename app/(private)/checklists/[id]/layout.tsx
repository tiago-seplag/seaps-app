import { notFound } from "next/navigation";
import { GoBack } from "@/components/go-back";
import { ENUM_PROPERTY, PropertyBadge } from "@/components/property-badge";
import { format } from "date-fns";
import { formatPhone, getFirstAndLastName } from "@/lib/utils";
import { Suspense } from "react";
import { getChecklistById } from "@/models/checklist";
import { FinishButton } from "../_components/finish-checklist-button";
import { ChecklistProvider } from "@/contexts/checklist-context";
import { getChecklistItems } from "@/models/checklist-item";
import Loading from "../loading";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  try {
    const checklist = await getChecklistById(id);

    const checklistItems = await getChecklistItems(id);

    return (
      <Suspense fallback={<Loading />}>
        <div className="flex h-full flex-1 flex-col gap-4">
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
              {checklist.property.person && (
                <div>
                  <p className="text-wrap">
                    {`${getFirstAndLastName(checklist.property.person?.name)} - ${checklist.property.person?.role || ""} - ${formatPhone(checklist.property.person?.phone)}`}
                  </p>
                </div>
              )}
            </div>
            <div className="w-full sm:w-auto sm:self-end">
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
                <FinishButton checklist={checklist} />
              )}
            </div>
          </div>
          <ChecklistProvider
            checklist={checklist}
            checklistItems={checklistItems}
          >
            {children}
          </ChecklistProvider>
        </div>
      </Suspense>
    );
  } catch {
    notFound();
  }
}

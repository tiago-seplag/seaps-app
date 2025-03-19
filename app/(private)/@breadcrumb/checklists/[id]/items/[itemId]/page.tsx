import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Fragment } from "react";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: true,
      checklistItems: {
        where: {
          id: itemId,
        },
        include: {
          item: true,
        },
      },
    },
  });

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/checklists">Checklists</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={"/checklists/" + checklist?.id + "/items/"} replace>
            {checklist?.property.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {checklist?.checklistItems.map((item, index) => {
        return (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === checklist.checklistItems.length - 1 ? (
                <BreadcrumbPage>{item.item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.id} replace>
                    {item.item.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        );
      })}
    </BreadcrumbList>
  );
}

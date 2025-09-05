import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    </BreadcrumbList>
  );
}

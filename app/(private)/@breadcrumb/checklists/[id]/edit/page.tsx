import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string; itemId?: string[] }>;
}) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const recursive = (level = 1): any => {
    if (level === 0) {
      return {
        include: {
          item: true,
        },
      };
    }

    return {
      include: {
        item: recursive(level - 1),
      },
    };
  };

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: true,
      checklistItems: true,
      person: true,
      user: true,
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
        <BreadcrumbPage>{checklist?.property.name}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}

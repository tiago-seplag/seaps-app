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

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: true,
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
        <BreadcrumbPage className="line-clamp-1 max-w-40 truncate text-ellipsis">
          {checklist?.property.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}

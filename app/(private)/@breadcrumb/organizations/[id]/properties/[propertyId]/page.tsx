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
  params: Promise<{ id: string; propertyId: string }>;
}) {
  const { id, propertyId } = await params;

  const organization = await prisma.organization.findUnique({
    where: { id: id },
    include: {
      properties: {
        where: { id: propertyId },
      },
    },
  });

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/organizations">Orgãos</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/organizations">{organization?.name}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{organization?.properties[0].name}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}

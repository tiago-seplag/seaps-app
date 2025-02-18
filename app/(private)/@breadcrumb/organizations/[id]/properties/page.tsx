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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const organization = await prisma.organization.findUnique({
    where: { id: id },
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
    </BreadcrumbList>
  );
}

import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import Link from "next/link";

export default async function BreadcrumbSlot() {
  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbPage>
          <Link href="/checklists">Checklists</Link>
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import checklist from "@/models/checklist";
import Link from "next/link";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string; itemId?: string[] }>;
}) {
  const { id } = await params;

  const _checklists = await checklist.getChecklistById(id);

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
          {_checklists?.property.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}

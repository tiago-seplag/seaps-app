import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Fragment } from "react";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string; itemId?: string[] }>;
}) {
  const { id, itemId } = await params;
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

  let items = [];

  if (itemId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items = await prisma.$queryRaw<any[]>(Prisma.sql`
      WITH RECURSIVE ancestors(id, name, item_id, level) AS (
          SELECT id, name, item_id, level
          FROM items
          WHERE id = ${itemId[itemId.length - 1]} 
          UNION ALL
          SELECT i.id, i.name, i.item_id, i.level
          FROM items i
          JOIN ancestors a ON i.id = a.item_id
        )
      SELECT id, name, level
        FROM ancestors
      ORDER BY level ASC;
    `);
  }

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/checklists">Checklists</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        {itemId && items ? (
          <BreadcrumbLink asChild>
            <Link href={"/checklists/" + checklist?.id + "/items/"} replace>
              {checklist?.property.name}
            </Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{checklist?.property.name}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {items &&
        itemId &&
        items.map((item, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.id} replace>
                      {item.name}
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

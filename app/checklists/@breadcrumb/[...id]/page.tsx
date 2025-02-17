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
  params: Promise<{ id: string[] }>;
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
    where: { id: id[0] },
    include: {
      property: {
        include: {
          items: {
            where: {
              id: id[id.length - 1],
            },
            select: {
              name: true,
            },
          },
        },
      },
      person: true,
      user: true,
    },
  });

  let items = [];

  if (id.length > 1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items = await prisma.$queryRaw<any[]>(Prisma.sql`
    WITH RECURSIVE ancestors(id, name, item_id, level) AS (
        SELECT id, name, item_id, level
        FROM items
        WHERE id = ${id[id.length - 1]} 
        UNION ALL
        SELECT i.id, i.name, i.item_id, i.level
        FROM items i
        JOIN ancestors a ON i.id = a.item_id
      )
    SELECT id, name, level
    FROM ancestors
    order by level asc;
    `);
  }

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/" replace>
            Checklists
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        {items.length > 0 ? (
          <BreadcrumbLink href={"/checklists/" + checklist?.id}>
            {checklist?.property.name}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{checklist?.property.name}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {items &&
        items.map((item, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={
                        "/checklists/" +
                        id
                          .slice(0, id.length - 1)
                          .toString()
                          .replaceAll(",", "/")
                      }
                      replace
                    >
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

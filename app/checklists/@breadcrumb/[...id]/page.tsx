import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Fragment } from "react";

export default async function BreadcrumbSlot({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  // Fetch dog from the api

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


  //   WITH RECURSIVE
  //    cnt(x) AS (
  //     SELECT 1
  //     UNION ALL
  //     SELECT x+1 FROM cnt
  //      LIMIT 1000000
  //    )
  //   SELECT x FROM cnt;

  const checklist = await prisma.checklist.findUnique({
    where: { id: id[0] },
    include: {
      property: {
        include: {
          items: {

            where: {
              id: id[id.length - 1]
            },
            select: {
              name: true
            }
          }
        },
      },
      person: true,
      user: true,
    },
  });


  if (id.length > 1) {
    const items = await prisma.$queryRaw(Prisma.sql`
        WITH RECURSIVE ascs(id, name, item_id) AS (
          SELECT id, name, item_id
          FROM items
          WHERE id = ${id[id.length - 2]}
          UNION ALL
            SELECT i.id, i.name, i.item_id
            FROM items i
            JOIN ascs a ON i.id = a.item_id
        )
        SELECT id, name
        FROM ascs;
    `)

    console.log(items)
  }

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/checklists">Checklists</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      {checklist?.property.items.map((item, index) => {
        return <Fragment key={index}>
          <BreadcrumbSeparator />
          <BreadcrumbItem >
            <BreadcrumbLink href="/dogs">{item.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Fragment>
      })}
    </BreadcrumbList>
  );
}

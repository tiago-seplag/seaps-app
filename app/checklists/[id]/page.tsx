import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ChecklistCard } from "@/components/checklist-card";
import { GoBack } from "@/components/go-back";

type ProjectPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    item_id: string;
  };
};

export default async function Page({ params, searchParams }: ProjectPageProps) {
  const { id } = await params;
  const { item_id } = await searchParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const recursive = (level = 1): any => {
    if (level === 0) {
      return {
        include: {
          steps: true,
        },
      };
    }

    return {
      include: {
        steps: recursive(level - 1),
      },
    };
  };

  const checklist = await prisma.checklist.findUnique({
    where: { id: id },
    include: {
      property: {
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
      person: true,
      user: true,
      checklistItems: {
        include: {
          item: {
            select: {
              name: true,
            },
          },
        },
        where: {
          item: {
            level: item_id ? undefined : 0,
            item_id: item_id ? item_id : undefined,
          },
        },
      },
      _count: {
        select: {
          checklistItems: true,
        },
      },
    },
  });

  if (!checklist) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-8 p-8">
      <div className="flex justify-between gap-2">
        <div className="flex items-center truncate">
          <GoBack />
          <h2
            className="truncate text-2xl font-bold tracking-tight"
            title={checklist.property.name}
          >
            {checklist.property.name}
          </h2>
        </div>
        <div className="flex gap-2 self-end">
          <Button asChild>
            <Link
              href={id + "/create-item?property_id=" + checklist.property_id}
            >
              <Plus />
              Criar Item
            </Link>
          </Button>
        </div>
      </div>
      <ul className="flex flex-col gap-y-2">
        {checklist.checklistItems.map((checklistItem) => (
          <li key={checklistItem.id}>
            <ChecklistCard
              checklistItem={checklistItem}
              propertyId={checklist.property_id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

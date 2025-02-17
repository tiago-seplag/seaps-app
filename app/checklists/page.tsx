import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const checklists = await prisma.checklist.findMany({
    include: {
      property: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Home</h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={"checklists/create"}>
              <Plus />
              Criar Checklist
            </Link>
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-y-2">
        {checklists.map((checklist) => (
          <li key={checklist.id}>
            <Link href={"/checklists/" + checklist.id}>
              {checklist.property.name}
            </Link>
            -{checklist.sid}
          </li>
        ))}
      </ul>
    </div>
  );
}

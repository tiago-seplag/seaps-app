import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const organizations = await prisma.item.findMany({
    where: {
      level: 0,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orgão</h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={"organizations/create"}>
              <Plus />
              Criar Item
            </Link>
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-y-2">
        {organizations.map((checklist) => (
          <li key={checklist.id}>
            <Link href={"/organizations/" + checklist.id + "/properties"}>
              {checklist.id}
            </Link>{" "}
            - {checklist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

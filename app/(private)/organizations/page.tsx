import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const organizations = await prisma.organization.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orgãos</h2>
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

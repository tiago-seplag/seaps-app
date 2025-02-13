import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const posts = await prisma.checklist.findMany();

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
              Adicionar Projeto
            </Link>
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={"/checklists/" + post.id}>{post.id}</Link> - {post.sid}
          </li>
        ))}
      </ul>
    </div>
  );
}

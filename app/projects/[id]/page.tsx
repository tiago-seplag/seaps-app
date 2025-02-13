import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./data-table";
import { ArrowLeft, Plus } from "lucide-react";

type ProjectPageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: ProjectPageProps) {
  const { id } = await params;

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

  const project = await prisma.project.findUnique({
    where: { id: id },
    include: {
      services: {
        include: {
          steps: true,
          organization: {
            select: { name: true },
          },
        },
        where: {
          step_id: null,
        },
        orderBy: {
          name: "asc",
        },
      },
      steps: true,
      _count: {
        select: {
          services: true,
          steps: true,
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-8 p-8">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <Button asChild variant={"ghost"} size="icon">
              <Link href={"/"}>
                <ArrowLeft />
              </Link>
            </Button>
            {project.name}
          </h2>

          <p className="text-muted-foreground">
            Items - {project._count.steps}
          </p>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={id + "/create-steps"}>
              <Plus />
              Adicionar Item
            </Link>
          </Button>
        </div>
      </div>
      <DataTable columns={project.steps} data={project.services} />
    </div>
  );
}

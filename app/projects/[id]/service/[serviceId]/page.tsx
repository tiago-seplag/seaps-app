import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { GoBack } from "../../_components/go-back";
import { format } from "date-fns";

type ProjectPageProps = {
  params: {
    serviceId: string;
    id: string;
  };
};

export default async function Page({ params }: ProjectPageProps) {
  const { id, serviceId } = await params;

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

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      steps: true,
      organization: {
        select: { name: true },
      },
      serviceHistories: {
        orderBy: {
          created_at: "desc",
        },
      },
      _count: {
        select: {
          steps: true,
        },
      },
    },
  });

  if (!service) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-8 p-8">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <GoBack />
            {service.name}
          </h2>

          <p className="text-muted-foreground">
            Items - {service._count.steps}
          </p>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={id + "/create-steps"}>
              <Plus />
              Adicionar Historico
            </Link>
          </Button>
        </div>
      </div>
      <ul className="flex flex-col gap-y-2">
        {service.serviceHistories.map((post) => (
          <li key={post.id}>
            {post.description} - {format(post.created_at, "dd/MM/yyyy 'as' HH:MM:SS")}
          </li>
        ))}
      </ul>
    </div>
  );
}

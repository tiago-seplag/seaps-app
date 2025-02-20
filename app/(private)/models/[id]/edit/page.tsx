import { GoBack } from "@/components/go-back";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditModelForm } from "../../_components/edit-model-form";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  const model = await prisma.model.findFirst({
    where: {
      id,
    },
    include: {
      modelItems: {
        include: {
          item: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!model) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-3 truncate">
        <GoBack />
        <h2
          className="truncate text-2xl font-bold tracking-tight"
          title={model.name}
        >
          {model.name}
        </h2>
      </div>
      <EditModelForm modelId={model.id} model={model} />
    </div>
  );
}

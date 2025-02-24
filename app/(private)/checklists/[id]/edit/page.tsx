import { GoBack } from "@/components/go-back";
import { EditCheckListForm } from "../../_components/edit-checklist-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCheckList({ params }: PageParams) {
  const { id } = await params;

  const checklist = await prisma.checklist.findFirst({
    where: {
      id,
    },
    include: {
      property: {
        select: {
          organization_id: true,
        },
      },
    },
  });

  if (!checklist) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">Editar Checklist</h2>
      </div>
      <EditCheckListForm checklist={checklist} />
    </div>
  );
}

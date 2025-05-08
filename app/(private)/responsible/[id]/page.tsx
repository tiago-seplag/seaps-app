import { GoBack } from "@/components/go-back";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditResponsibleForm } from "../_components/edit-responsible-form";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProperty({ params }: PageParams) {
  const { id } = await params;

  const person = await prisma.person.findFirst({
    where: { id },
  });

  if (!person) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <GoBack />
        <h2 className="text-2xl font-bold tracking-tight">
          Editar Responsável
        </h2>
      </div>
      <EditResponsibleForm person={person} />
    </div>
  );
}

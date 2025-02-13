import Link from "next/link";
import { StepsForm } from "./_components/create-steps-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

type CreateStepsPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    step_id?: string;
    level: string;
  };
};

export default async function AddService({
  params,
  searchParams,
}: CreateStepsPageProps) {
  const { id } = await params;
  const { level } = await searchParams;

  const project = await prisma.project.findFirstOrThrow({
    where: { id },
    include: {
      steps: true,
    },
  });

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center gap-8">
        <Button asChild variant={"ghost"}>
          <Link href={"/projects/" + id}>
            <ArrowLeft /> Voltar
          </Link>
        </Button>
        <h2>Adicionar Serviço</h2>
      </div>

      <StepsForm projectId={id} level={level} steps={project.steps} />
    </div>
  );
}

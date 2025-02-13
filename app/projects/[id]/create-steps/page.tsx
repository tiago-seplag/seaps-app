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

export default async function CreateSteps({
  params,
  searchParams,
}: CreateStepsPageProps) {
  const { id } = await params;
  const { step_id, level } = await searchParams;
  let step;

  if (step_id) {
    step = await prisma.step.findUniqueOrThrow({
      where: { id: step_id },
    });
  }

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center gap-8">
        <Button asChild variant={"ghost"}>
          <Link href={"/projects/" + id}>
            <ArrowLeft /> Voltar
          </Link>
        </Button>
        <h2>Criar Item</h2>
      </div>

      <StepsForm projectId={id} level={level} step={step} />
    </div>
  );
}

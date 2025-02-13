import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const steps = await prisma.step.findMany({
    where: { project_id: id },
  });

  return Response.json(steps);
}

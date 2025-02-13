import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const properties = await prisma.property.findMany({
    where: { organization_id: id },
  });

  return Response.json(properties);
}

import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const model = await prisma.model.findFirst({
    where: { id: id },
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
  });

  return Response.json(model);
}

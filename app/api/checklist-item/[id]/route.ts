import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();

  await prisma.checklistItems.update({
    data: {
      score: Number(data.score) ?? Number(data.score),
      is_inspected: true,
      observation: data.observation ?? data.observation,
    },
    where: {
      id,
    },
  });

  return Response.json({ ok: "ok" });
}

const getHandler = async (
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const checklist = await prisma.checklistItems.findUnique({
    where: { id: id },
    include: {
      item: true,
      images: true,
    },
  });

  return Response.json(checklist);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

export async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;

  const { id } = await params;

  const checklist = await prisma.checklist.findFirstOrThrow({
    where: { id },
    include: {
      checklistItems: {
        include: {
          item: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (userId !== checklist.user_id) {
    return Response.json(
      { error: "forbidden", message: "Apenas o responsável pode finalizar" },
      { status: 403 },
    );
  }

  const uncheckedItems = [];

  for (const item of checklist?.checklistItems) {
    if (item._count.images < 1) {
      return Response.json(
        {
          error: "validation error",
          message: "Todos os itens devem conter ao menos uma imagem",
        },
        { status: 400 },
      );
    }
    if (typeof item.score !== "number") {
      uncheckedItems.push(item.item);
    }
  }

  if (uncheckedItems.length > 0) {
    return Response.json(
      {
        error: "validation error",
        messages: uncheckedItems.map(
          (item) => `O item '${item.name}' não foi pontuado`,
        ),
      },
      { status: 400 },
    );
  }

  const finishedChecklist = await prisma.checklist.update({
    where: { id },
    data: {
      status: "CLOSED",
      finished_at: new Date(),
    },
  });

  return Response.json(finishedChecklist);
}

export const PUT = withMiddlewares([authMiddleware], putHandler);

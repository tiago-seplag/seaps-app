import { prisma } from "@/lib/prisma";
import {
  updateChecklistItem,
  updateChecklistItemSchema,
} from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;

  const { id } = await params;
  const data = await request.json();

  return updateChecklistItem(id, userId, data);
};

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

export const PUT = withMiddlewares(
  [authMiddleware, validation(updateChecklistItemSchema)],
  putHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

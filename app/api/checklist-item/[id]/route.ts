import { ValidationError } from "@/errors/validation-error";

import {
  getChecklistItemById,
  updateChecklistItem,
  updateChecklistItemSchema,
} from "@/models/checklist-item";
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

  try {
    const finishedChecklist = await updateChecklistItem(id, userId, data);
    return Response.json(finishedChecklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });

    return Response.json({ error }, { status: 500 });
  }
};

const getHandler = async (
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    const checklistItem = await getChecklistItemById(id);

    return Response.json(checklistItem);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });

    return Response.json({ error }, { status: 500 });
  }
};

export const PUT = withMiddlewares(
  [authMiddleware, validation(updateChecklistItemSchema)],
  putHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

import { ValidationError } from "@/errors/validation-error";
import controller, { handler } from "@/infra/controller";

import {
  getChecklistItemById,
  updateChecklistItem,
  updateSchema,
} from "@/models/checklist-item";
import { NextRequest } from "next/server";

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;
  const role = request.headers.get("x-user-role")!;

  const { id } = await params;
  const data = await request.json();

  try {
    const finishedChecklist = await updateChecklistItem(id, data, {
      id: userId,
      role,
    });
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

export const PUT = handler(
  [controller.authenticate, controller.validateBody(updateSchema)],
  putHandler,
);

export const GET = handler([controller.authenticate], getHandler);

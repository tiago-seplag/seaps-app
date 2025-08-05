import { ValidationError } from "@/errors/validation-error";
import { getChecklistItems } from "@/models/checklist-item";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

const getHandler = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    const checklist = await getChecklistItems(id);
    return Response.json(checklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

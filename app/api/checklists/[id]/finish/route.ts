import { ValidationError } from "@/errors/validation-error";
import { finishChecklist } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;
  const userRole = request.headers.get("x-user-role")!;

  const { id } = await params;

  try {
    const finishedChecklist = await finishChecklist(id, {
      id: userId,
      role: userRole,
    });
    return Response.json(finishedChecklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const PUT = withMiddlewares([authMiddleware], putHandler);

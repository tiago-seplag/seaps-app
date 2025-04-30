import { ValidationError } from "@/errors/validation-error";
import { reOpenChecklist } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

async function postHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const reopenedChecklist = await reOpenChecklist(id);
    return Response.json(reopenedChecklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const POST = withMiddlewares(
  [authMiddleware, authorization("ADMIN", "SUPERVISOR")],
  postHandler,
);

import { ValidationError } from "@/errors/validation-error";
import { updateConfigSchema, updateUserConfigs } from "@/models/user";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const values = await request.json();

  try {
    const finishedChecklist = await updateUserConfigs(id, values);
    return Response.json(finishedChecklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const PUT = withMiddlewares(
  [authMiddleware, authorization("ADMIN"), validation(updateConfigSchema)],
  putHandler,
);

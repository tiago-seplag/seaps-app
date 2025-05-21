import { ValidationError } from "@/errors/validation-error";
import {
  ResponsibleSchema,
  responsibleSchema,
  updateResponsible,
} from "@/models/responsible";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: ResponsibleSchema = await request.json();

  try {
    const responsible = await updateResponsible(data, id);
    return Response.json(responsible);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const PUT = withMiddlewares(
  [
    authMiddleware,
    validation(responsibleSchema),
    authorization("ADMIN", "SUPERVISOR"),
  ],
  putHandler,
);

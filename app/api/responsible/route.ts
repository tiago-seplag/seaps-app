import { ValidationError } from "@/errors/validation-error";
import {
  createResponsible,
  responsibleSchema,
  ResponsibleSchema,
} from "@/models/responsible";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

const postHandler = async (request: NextRequest) => {
  const data: ResponsibleSchema = await request.json();

  try {
    const checklist = await createResponsible(data);
    return Response.json(checklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const POST = withMiddlewares(
  [
    authMiddleware,
    authorization("ADMIN", "SUPERVISOR"),
    validation(responsibleSchema),
  ],
  postHandler,
);

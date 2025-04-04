import { ValidationError } from "@/errors/validation-error";
import { generateTempPassword } from "@/models/user";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

const putHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  const data = await request.json();

  try {
    const finishedChecklist = await generateTempPassword(data.password, userId);
    return Response.json(finishedChecklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });

    return Response.json({ error }, { status: 500 });
  }
};

export const PUT = withMiddlewares([authMiddleware], putHandler);

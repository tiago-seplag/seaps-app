import { ValidationError } from "@/errors/validation-error";
import { getUserById } from "@/models/user";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

const getHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  try {
    const user = await getUserById(userId);
    return Response.json(user);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

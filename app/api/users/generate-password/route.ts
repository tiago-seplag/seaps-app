import { ValidationError } from "@/errors/validation-error";
import controller, { handler } from "@/infra/controller";
import { generateTempPassword } from "@/models/user";
import { NextRequest } from "next/server";

const putHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  try {
    const password = await generateTempPassword(userId);
    return Response.json({ password });
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });

    return Response.json({ error }, { status: 500 });
  }
};

export const PUT = handler([controller.authenticate], putHandler);

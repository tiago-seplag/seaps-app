import controller, { handler } from "@/infra/controller";
import { generateTempPassword } from "@/models/user";
import { NextRequest } from "next/server";

const putHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  const password = await generateTempPassword(userId);
  return Response.json({ password });
};

export const PUT = handler([controller.authenticate], putHandler);

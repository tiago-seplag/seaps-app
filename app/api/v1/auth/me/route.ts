import controller, { handler } from "@/infra/controller";
import session from "@/models/session";
import { cookies } from "next/headers";

const getHandler = async () => {
  const cookie = await cookies();

  const token = cookie.get("session")?.value;

  const user = await session.findUser(token!);
  return Response.json(user);
};

export const GET = handler([controller.authenticate], getHandler);

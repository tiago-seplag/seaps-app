import controller, { handler } from "@/infra/controller";
import user from "@/models/user";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const foundUser = await user.findOrThrow(id);

  return Response.json(foundUser);
}

export const GET = handler([controller.authenticate], getHandler);

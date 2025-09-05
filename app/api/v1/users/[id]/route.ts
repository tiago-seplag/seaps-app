import controller, { handler } from "@/infra/controller";
import { ValidationError } from "@/infra/errors";
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

async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;

  const { id } = await params;

  const data = await request.json();

  if (id === userId) {
    throw new ValidationError({
      message: "Você não pode atualizar as permissões do seu próprio usuário.",
      action:
        "Tente utilizar o endpoint apropriado para atualizar seu próprio usuário.",
    });
  }

  const updatedUser = await user.updateConfigs(id, data);

  return Response.json(updatedUser);
}

export const PUT = handler([controller.authenticate], putHandler);

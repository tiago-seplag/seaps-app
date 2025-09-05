import controller, { handler } from "@/infra/controller";
import { ValidationError } from "@/infra/errors";
import property from "@/models/property";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");
  const organization_id = request.nextUrl.searchParams.get("organization_id");
  const id = request.nextUrl.searchParams.get("id") || undefined;

  if (!name) {
    throw new ValidationError({
      message: "O parâmetro de nome é obrigatório",
      action: "Por favor, forneça um nome para verificar",
    });
  }

  if (!organization_id) {
    throw new ValidationError({
      message: "O parâmetro de organization_id é obrigatório",
      action: "Por favor, forneça um organization_id para verificar",
    });
  }

  const findedProperty = await property.findByName({
    name: decodeURIComponent(name),
    id,
    organization_id,
  });

  if (!findedProperty) {
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false });
}

export const GET = handler([controller.authenticate], getHandler);

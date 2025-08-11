import controller, { handler } from "@/infra/controller";
import { ValidationError } from "@/infra/errors";
import property from "@/models/property";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    throw new ValidationError({
      message: "O parâmetro de nome é obrigatório",
      action: "Por favor, forneça um nome para verificar",
    });
  }

  const findedProperty = await property.findByName(name);

  if (!findedProperty) {
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false });
}

export const GET = handler([controller.authenticate], getHandler);

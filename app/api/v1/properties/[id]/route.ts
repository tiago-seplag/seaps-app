import controller, { handler } from "@/infra/controller";
import property, { PropertySchema, propertySchema } from "@/models/property";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const _property = await property.findById(id);

  return Response.json(_property);
}

export const GET = handler([controller.authenticate], getHandler);

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: PropertySchema = await request.json();

  const _property = await property.update(id, data);

  return Response.json(_property);
};

export const PUT = handler(
  [
    controller.authenticate,
    controller.authorize("SUPERVISOR", "ADMIN"),
    validation(propertySchema),
  ],
  putHandler,
);

const deleteHandler = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  await property.delete(id);

  return Response.json({ message: "Imóvel deletado com sucesso" });
};

export const DELETE = handler(
  [controller.authenticate, controller.authorize("SUPERVISOR", "ADMIN")],
  deleteHandler,
);

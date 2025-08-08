import controller from "@/infra/controller";
import property, { PropertySchema, propertySchema } from "@/models/property";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const _property = await prisma.property.findFirst({
    where: { id: id },
    include: {
      organization: true,
      person: true,
    },
  });

  return Response.json(_property);
}

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: PropertySchema = await request.json();

  const _property = await property.update(id, data);

  return Response.json(_property);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const PUT = withMiddlewares(
  [authMiddleware, validation(propertySchema)],
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

export const DELETE = withMiddlewares([controller.authenticate], deleteHandler);

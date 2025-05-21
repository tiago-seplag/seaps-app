import { ValidationError } from "@/errors/validation-error";
import { prisma } from "@/lib/prisma";
import {
  PropertySchema,
  propertySchema,
  updatePropertyById,
} from "@/models/property";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id: id },
    include: {
      organization: true,
      person: true,
    },
  });

  return Response.json(property);
}

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: PropertySchema = await request.json();

  try {
    const property = await updatePropertyById(id, data);
    return Response.json(property);
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const PUT = withMiddlewares(
  [authMiddleware, validation(propertySchema)],
  putHandler,
);

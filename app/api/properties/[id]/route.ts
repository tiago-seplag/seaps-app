import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

const propertySchema = z.object({
  organization_id: z.string(),
  name: z.string().min(2),
  address: z.string().optional(),
  type: z.enum(["GRANT", "OWN", "RENTED"]),
  person_id: z.string(),
});

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
  const values: z.infer<typeof propertySchema> = await request.json();

  const property = await prisma.property.update({
    where: { id },
    data: values,
  });

  return Response.json(property);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const PUT = withMiddlewares(
  [authMiddleware, validation(propertySchema)],
  putHandler,
);

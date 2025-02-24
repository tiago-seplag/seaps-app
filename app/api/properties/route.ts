import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/auth";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

async function getHandler() {
  const properties = await prisma.property.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(properties);
}

export const propertySchema = z.object({
  organization_id: z.string(),
  name: z.string().min(2),
  address: z.string().optional(),
  type: z.string(),
  person_id: z.string(),
});

const postHandler = async (request: NextRequest) => {
  const values: z.infer<typeof propertySchema> = await request.json();

  const property = await prisma.property.create({
    data: values,
  });

  return Response.json(property);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const POST = withMiddlewares(
  [authMiddleware, validation(propertySchema)],
  postHandler,
);

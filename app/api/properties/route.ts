import { prisma } from "@/lib/prisma";
import { getPropertiesPaginated } from "@/models/property";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

async function getHandler(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "10";

  const { data, meta } = await getPropertiesPaginated(
    Number(page),
    Number(per_page),
    searchParams,
  );

  return Response.json({ data, meta });
}

const propertySchema = z.object({
  organization_id: z.string(),
  name: z.string().min(2),
  address: z.string().optional(),
  type: z.enum(["GRANT", "OWN", "RENTED"]),
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

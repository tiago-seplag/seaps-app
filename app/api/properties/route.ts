import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

async function getHandler(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const total = await prisma.property.count();

  const meta = generateMetaPagination(
    Number(searchParams.get("page") || 1),
    Number(searchParams.get("per_page") || 10),
    total,
  );

  const properties = await prisma.property.findMany({
    include: {
      organization: true,
      person: {
        select: { name: true },
      },
    },
    orderBy: {
      organization: {
        name: "asc",
      },
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return Response.json({ data: properties, meta });
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

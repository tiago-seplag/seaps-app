import controller from "@/infra/controller";
import property from "@/models/property";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

async function getHandler(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "10";

  const data = await property.paginated({
    page: Number(page),
    per_page: Number(per_page),
    organizationId: searchParams.get("organization_id") || undefined,
    created_by: searchParams.get("created_by") || undefined,
  });

  return Response.json(data);
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

  const createdProperty = await property.create(
    values,
    request.headers.get("x-user-id")!,
  );

  return Response.json(createdProperty);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const POST = withMiddlewares(
  [controller.authenticate, validation(propertySchema)],
  postHandler,
);


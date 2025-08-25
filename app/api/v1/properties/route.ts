import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import properties, { propertySchema } from "@/models/property";
import property from "@/models/property";

async function getHandler(request: NextRequest) {
  const data = await properties.paginated({
    page: request.nextUrl.searchParams.get("page"),
    per_page: request.nextUrl.searchParams.get("per_page"),
    organization_id: request.nextUrl.searchParams.get("organization_id"),
  });

  return Response.json(data);
}

export const GET = handler(
  [controller.authenticate, controller.pagination],
  getHandler,
);

const postHandler = async (request: NextRequest) => {
  const values = await request.json();

  const createdProperty = await property.create(
    values,
    request.headers.get("x-user-id")!,
  );

  return Response.json(createdProperty);
};

export const POST = handler(
  [
    controller.authenticate,
    controller.authorize("SUPERVISOR", "ADMIN"),
    controller.validateBody(propertySchema),
  ],
  postHandler,
);

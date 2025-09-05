import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import properties, { propertySchema } from "@/models/property";
import property from "@/models/property";

async function getHandler(request: NextRequest) {
  const data = await properties.paginated({
    page: request.nextUrl.searchParams.get("page"),
    per_page: request.nextUrl.searchParams.get("per_page"),
    organization_id: request.nextUrl.searchParams.get("organization_id"),
    type: request.nextUrl.searchParams.get("type"),
    name: request.nextUrl.searchParams.get("name"),
    city: request.nextUrl.searchParams.get("city"),
    created_by: request.nextUrl.searchParams.get("created_by"),
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
    controller.authorize("properties:create"),
    controller.validateBody(propertySchema),
  ],
  postHandler,
);

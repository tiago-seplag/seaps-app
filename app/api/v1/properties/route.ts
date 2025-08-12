import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import properties from "@/models/property";

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

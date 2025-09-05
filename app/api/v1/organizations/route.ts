import controller, { handler } from "@/infra/controller";
import organization from "@/models/organization";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page"));
  const perPage = Number(request.nextUrl.searchParams.get("per_page"));

  const organizations = await organization.paginated(page, perPage);

  return Response.json(organizations);
}

export const GET = handler(
  [controller.authenticate, controller.pagination],
  getHandler,
);

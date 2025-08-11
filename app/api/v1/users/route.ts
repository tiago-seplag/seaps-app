import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import user from "@/models/user";

async function getHandler(request: NextRequest) {
  const data = await user.paginated({
    page: request.nextUrl.searchParams.get("page"),
    per_page: request.nextUrl.searchParams.get("per_page"),
    role: request.nextUrl.searchParams.get("role"),
  });

  return Response.json(data);
}

export const GET = handler(
  [controller.authenticate, controller.pagination],
  getHandler,
);

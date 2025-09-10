import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";

async function postHandler(request: NextRequest) {
  const body = await request.json();

  const createdChecklist = await checklist.createChecklist(body);

  await checklist.createLog({
    action: "checklist:create",
    checklist_id: createdChecklist.id,
    user_id: request.headers.get("x-user-id")!,
    value: body,
    status: "OPEN",
  });

  return Response.json(createdChecklist, { status: 201 });
}

async function getHandler(request: NextRequest) {
  const permissions =
    request.headers.get("x-user-permissions")?.split(",") || [];

  const userId = request.headers.get("x-user-id");

  const query: Record<string, string> = {};

  if (
    !permissions.some((p: string) => p === "*" || p === "checklists:view_all")
  ) {
    query.user_id = userId!;
  }

  const data = await checklist.paginated({
    page: request.nextUrl.searchParams.get("page"),
    per_page: request.nextUrl.searchParams.get("per_page"),
    organization_id: request.nextUrl.searchParams.get("organization_id"),
    user_id: query.user_id
      ? query.user_id
      : request.nextUrl.searchParams.get("user_id"),
    property_name: request.nextUrl.searchParams.get("property_name"),
    status: request.nextUrl.searchParams.get("status"),
  });

  return Response.json(data);
}

export const GET = handler(
  [controller.authenticate, controller.pagination],
  getHandler,
);

export const POST = handler(
  [
    controller.authenticate,
    controller.authorize("ADMIN", "SUPERVISOR"),
    controller.validateBody(checklist.createSchema),
  ],
  postHandler,
);

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
    status: "OPEN",
  });

  return Response.json(createdChecklist, { status: 201 });
}

async function getHandler(request: NextRequest) {
  const data = await checklist.paginated({
    page: request.nextUrl.searchParams.get("page"),
    per_page: request.nextUrl.searchParams.get("per_page"),
    organization: request.nextUrl.searchParams.get("organization"),
    user: {
      id: request.headers.get("x-user-id"),
      role: request.headers.get("x-user-role") || "EVALUATOR",
    },
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

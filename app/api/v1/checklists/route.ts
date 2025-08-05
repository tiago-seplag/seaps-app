import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";

async function postHandler(request: NextRequest) {
  const body = await request.json();

  const createdChecklist = await checklist.createChecklist(body);

  await checklist.createLog({
    action: "create",
    checklist_id: createdChecklist.id,
    user_id: request.headers.get("x-user-id")!,
  });

  return Response.json(createdChecklist, { status: 201 });
}

export const POST = handler(
  [controller.authenticate, controller.validateBody(checklist.createSchema)],
  postHandler,
);

import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import { NextRequest } from "next/server";

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;

  const body = await request.json();

  const { id } = await params;

  const validatedChecklist = await checklist.validate(id);

  await checklist.createLog({
    action: "checklist:" + validatedChecklist.status.toLowerCase(),
    checklist_id: id,
    user_id: userId,
    status: validatedChecklist.status,
    value: body,
  });

  return Response.json(validatedChecklist);
}

export const PUT = handler(
  [
    controller.authenticate,
    controller.authorize("SUPERVISOR"),
    controller.validateUUID("id"),
    controller.validateBody(checklist.schemas.validate),
  ],
  putHandler,
);

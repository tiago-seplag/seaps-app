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

  const validatedChecklist = await checklist.validate(id, body.status);

  await checklist.createLog({
    action: "checklist:" + body.status.toLowerCase(),
    checklist_id: id,
    user_id: userId,
    status: validatedChecklist.status,
    observation: body.observation,
  });

  return Response.json(validatedChecklist);
}

export const PUT = handler(
  [
    controller.authenticate,
    controller.authorize("SUPERVISOR"),
    controller.validateBody(checklist.ValidateSchema),
  ],
  putHandler,
);

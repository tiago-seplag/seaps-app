import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import { NextRequest } from "next/server";

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;
  const userRole = request.headers.get("x-user-role")!;

  const { id } = await params;

  const finishedChecklist = await checklist.finishChecklist(id, {
    id: userId,
    role: userRole,
  });

  await checklist.createLog({
    action: "checklist:finish",
    checklist_id: id,
    user_id: userId,
    status: "CLOSED",
  });

  return Response.json(finishedChecklist);
}

export const PUT = handler(
  [controller.authenticate, controller.authorize("SUPERVISOR")],
  putHandler,
);

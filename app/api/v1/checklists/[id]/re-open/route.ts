import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import { NextRequest } from "next/server";

async function postHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const reopenedChecklist = await checklist.reOpenChecklist(id);

  await checklist.createLog({
    action: "checklist:re_open",
    checklist_id: id,
    user_id: request.headers.get("x-user-id")!,
    status: "OPEN",
  });

  return Response.json(reopenedChecklist);
}

export const POST = handler(
  [controller.authenticate, controller.authorize("ADMIN", "SUPERVISOR")],
  postHandler,
);

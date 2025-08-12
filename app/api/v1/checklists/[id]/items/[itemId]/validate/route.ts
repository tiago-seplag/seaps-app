import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import checklistItem from "@/models/checklist-item";

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;

  const { itemId, id } = await params;

  const data = await request.json();

  const validated = await checklistItem.validate(data, {
    itemId,
    checklistId: id,
  });

  await checklist.createLog({
    action: "checklist_items:validated",
    checklist_item_id: validated.id,
    checklist_id: validated.checklist_id,
    user_id: userId,
  });

  return Response.json(validated);
};

export const PUT = handler(
  [
    controller.authenticate,
    controller.authorize("SUPERVISOR", "ADMIN"),
    controller.validateUUID("id", "itemId"),
    controller.validateBody(checklistItem.schemas.validate),
  ],
  putHandler,
);

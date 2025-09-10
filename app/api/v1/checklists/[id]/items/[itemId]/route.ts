import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import checklistItem from "@/models/checklist-item";

async function get(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const { itemId } = await params;
  const checklistItems = await checklistItem.findById(itemId);

  return Response.json(checklistItems);
}

export const GET = handler(
  [controller.authenticate, controller.validateUUID("id", "itemId")],
  get,
);

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;
  const role = request.headers.get("x-user-role")!;

  const { itemId } = await params;

  const data = await request.json();

  const updatedChecklistItem = await checklistItem.update(itemId, data, {
    id: userId,
    role,
  });

  await checklist.createLog({
    action: "checklist_item:update",
    checklist_item_id: updatedChecklistItem.id,
    checklist_id: updatedChecklistItem.checklist_id,
    user_id: userId,
    value: data,
  });

  return Response.json(updatedChecklistItem);
};

export const PUT = handler(
  [
    controller.authenticate,
    controller.validateUUID("id", "itemId"),
    controller.validateBody(checklistItem.schemas.update),
  ],
  putHandler,
);

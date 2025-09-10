import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklistItem, { updateSchema } from "@/models/checklist-item";
import checklist from "@/models/checklist";

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;
  const role = request.headers.get("x-user-role")!;
  const permissions = request.headers.get("x-user-permissions")!;

  const { id } = await params;
  const data = await request.json();

  const updatedItem = await checklistItem.update(id, data, {
    id: userId,
    role,
    permissions: permissions ? permissions.split(",") : [],
  });

  await checklist.createLog({
    action: "checklist_item:update",
    checklist_item_id: id,
    checklist_id: updatedItem.checklist_id,
    user_id: userId,
    value: data,
  });

  return Response.json(updatedItem);
};

const getHandler = async (
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const _checklistItem = await checklistItem.findById(id);

  return Response.json(_checklistItem);
};

export const PUT = handler(
  [controller.authenticate, controller.validateBody(updateSchema)],
  putHandler,
);

export const GET = handler([controller.authenticate], getHandler);

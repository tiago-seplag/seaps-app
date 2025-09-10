import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";

async function get(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const checklistData = await checklist.getChecklistById(id);

  return Response.json(checklistData);
}

export const GET = handler(
  [controller.authenticate, controller.validateUUID("id")],
  get,
);

const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const userId = request.headers.get("x-user-id")!;
  const { id } = await params;
  const values = await request.json();

  const _checklist = await checklist.update(id, values);

  await checklist.createLog({
    action: "checklist:updated",
    checklist_id: id,
    user_id: userId,
    status: _checklist.status,
    value: values,
  });

  return Response.json(_checklist);
};

export const PUT = handler(
  [
    controller.authenticate,
    controller.authorize("checklists:edit"),
    controller.validateUUID("id"),
    controller.validateBody(checklist.schemas.update),
  ],
  putHandler,
);

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;
  const { id } = await params;
  const data = await checklist.delete(id);

  await checklist.createLog({
    action: "checklist:delete",
    checklist_id: id,
    user_id: userId,
    status: data.status,
  });

  return Response.json(data);
}

export const DELETE = handler(
  [
    controller.authenticate,
    controller.validateUUID("id"),
    controller.authorize("checklists:delete"),
  ],
  deleteHandler,
);

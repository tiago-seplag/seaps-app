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

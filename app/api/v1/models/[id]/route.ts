import controller, { handler } from "@/infra/controller";
import model from "@/models/model";
import { NextRequest } from "next/server";

async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const _model = await model.getModelById(id);

  return Response.json(_model);
}

export const GET = handler([controller.authenticate], getHandler);

import controller, { handler } from "@/infra/controller";
import model from "@/models/model";
import { NextRequest } from "next/server";

async function getHandler(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const _model = await model.getModelById(id);

  return Response.json(_model);
}

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const data = await request.json();

  const _model = await model.update(id, data);

  return Response.json(_model);
}

export const GET = handler([controller.authenticate], getHandler);

export const PUT = handler(
  [controller.authenticate, controller.validateBody(model.createSchema)],
  putHandler,
);

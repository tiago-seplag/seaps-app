import controller, { handler } from "@/infra/controller";
import model from "@/models/model";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const perPage = Number(request.nextUrl.searchParams.get("per_page") || 10);

  const models = await model.paginated(page, perPage);

  return Response.json(models);
}

async function postHandler(request: NextRequest) {
  const body = await request.json();

  const createdModel = await model.createModel(body);

  return Response.json(createdModel, { status: 201 });
}

export const GET = handler([controller.authenticate], getHandler);

export const POST = handler(
  [controller.authenticate, controller.validateBody(model.createSchema)],
  postHandler,
);

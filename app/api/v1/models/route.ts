import controller, { handler } from "@/infra/controller";
import person from "@/models/persons";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const perPage = Number(request.nextUrl.searchParams.get("per_page") || 10);

  const models = await person.paginated(page, perPage);

  return Response.json(models);
}

async function postHandler(request: NextRequest) {
  const body = await request.json();

  const model = await person.createPerson(body);

  return Response.json(model, { status: 201 });
}

export const GET = handler([controller.authenticate], getHandler);

export const POST = handler(
  [controller.authenticate, controller.validateBody(person.createPersonSchema)],
  postHandler,
);

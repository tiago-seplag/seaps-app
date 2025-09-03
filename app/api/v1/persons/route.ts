import controller, { handler } from "@/infra/controller";
import person from "@/models/persons";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const perPage = Number(request.nextUrl.searchParams.get("per_page") || 10);
  const organization_id = request.nextUrl.searchParams.get("organization_id");

  const persons = await person.paginated(page, perPage, { organization_id });

  return Response.json(persons);
}

async function postHandler(request: NextRequest) {
  const body = await request.json();

  const newPerson = await person.createPerson(body);

  return Response.json(newPerson, { status: 201 });
}

export const GET = handler([controller.authenticate], getHandler);

export const POST = handler(
  [controller.authenticate, controller.validateBody(person.createPersonSchema)],
  postHandler,
);

import { ValidationError } from "@/errors/validation-error";
import {
  ChecklistSchema,
  checklistSchema,
  createChecklist,
  getChecklistsPaginated,
} from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";

const postHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  const values: ChecklistSchema = await request.json();

  try {
    const checklist = await createChecklist(values, userId);
    return Response.json(checklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

const getHandler = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const userId = request.headers.get("x-user-id")!;
  const role = request.headers.get("x-user-role")!;

  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";

  const search = Object.fromEntries(searchParams.entries());

  try {
    const checklists = await getChecklistsPaginated(
      Number(page),
      Number(perPage),
      {
        ...search,
        user: role !== "ADMIN" ? userId : undefined,
      },
    );
    return Response.json(checklists);
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const POST = withMiddlewares(
  [
    authMiddleware,
    authorization("ADMIN", "SUPERVISOR"),
    validation(checklistSchema),
  ],
  postHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

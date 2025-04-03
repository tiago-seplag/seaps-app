import { ValidationError } from "@/errors/validation-error";
import {
  ChecklistSchema,
  checklistSchema,
  createChecklist,
  getChecklistsPaginated,
} from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
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

const getHandler = async (req: NextRequest) => {
 const searchParams = req.nextUrl.searchParams;
  try {
    const checklists = await getChecklistsPaginated(
      Number(searchParams.get("page")),
      Number(searchParams.get("per_page")),
    );
    return Response.json(checklists);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const POST = withMiddlewares(
  [authMiddleware, validation(checklistSchema)],
  postHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

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

  const checklist = await createChecklist(values, userId);

  return Response.json(checklist);
};

const getHandler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const data = await getChecklistsPaginated(
    Number(searchParams.get("page")),
    Number(searchParams.get("per_page")),
  );

  return Response.json(data);
};

export const POST = withMiddlewares(
  [authMiddleware, validation(checklistSchema)],
  postHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

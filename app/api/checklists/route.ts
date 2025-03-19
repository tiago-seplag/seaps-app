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

  return createChecklist(values, userId);
};

const getHandler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  return getChecklistsPaginated(
    Number(searchParams.get("page")),
    Number(searchParams.get("per_page")),
  );
};

export const POST = withMiddlewares(
  [authMiddleware, validation(checklistSchema)],
  postHandler,
);

export const GET = withMiddlewares([authMiddleware], getHandler);

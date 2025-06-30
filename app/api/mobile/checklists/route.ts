import { ValidationError } from "@/errors/validation-error";
import { getChecklistsPaginated } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

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
        user: role !== "ADMIN" ? userId : undefined,
        ...search,
      },
    );
    return Response.json(checklists);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

import { ValidationError } from "@/errors/validation-error";
import { getChecklistItemById } from "@/models/checklist-item";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

const getHandler = async (
  _: Request,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  const { itemId } = await params;

  try {
    const checklistItem = await getChecklistItemById(itemId);

    return Response.json(checklistItem);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });

    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

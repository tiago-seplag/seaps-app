import { finishChecklist } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id")!;

  const { id } = await params;

  return finishChecklist(id, userId);
}

export const PUT = withMiddlewares([authMiddleware], putHandler);

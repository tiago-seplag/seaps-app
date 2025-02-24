import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  user_id: z.string(),
});

export const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const values: z.infer<typeof updateSchema> = await request.json();

  const checklist = await prisma.checklist.update({
    where: { id },
    data: {
      user_id: values.user_id,
    },
  });

  return Response.json(checklist);
};

export const PUT = withMiddlewares(
  [authMiddleware, validation(updateSchema)],
  putHandler,
);

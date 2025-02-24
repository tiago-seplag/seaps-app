import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/auth";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

const checklistSchema = z.object({
  model_id: z.string(),
  organization_id: z.string(),
  property_id: z.string(),
  user_id: z.string(),
});

export const postHandler = async (request: NextRequest) => {
  const userId = request.headers.get("x-user-id")!;

  const values: z.infer<typeof checklistSchema> = await request.json();

  const lastChecklist = await prisma.checklist.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  const year = new Date().getFullYear().toString().slice(2);

  let sid = "0001/" + year;

  if (lastChecklist && lastChecklist.sid.slice(-2) === year) {
    const number = Number(lastChecklist.sid.slice(0, 4)) + 1;
    sid = number.toString().padStart(4, "0") + "/" + year;
  }

  const checklist = await prisma.checklist.create({
    data: {
      created_by: userId,
      user_id: values.user_id,
      property_id: values.property_id,
      sid: sid,
      model_id: values.model_id,
    },
  });

  const items = await prisma.item.findMany({
    where: {
      modelItems: {
        some: {
          model_id: values.model_id,
        },
      },
    },
  });

  if (items.length > 0) {
    await prisma.checklistItems.createMany({
      data: items.map((item) => {
        return { item_id: item.id, checklist_id: checklist.id };
      }),
    });
  }

  return Response.json(checklist);
};

export const POST = withMiddlewares(
  [authMiddleware, validation(checklistSchema)],
  postHandler,
);

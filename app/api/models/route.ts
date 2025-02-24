import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { authorization } from "@/utils/authorization";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";

async function getHandler() {
  const models = await prisma.model.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(models);
}

export const modelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
      }),
    )
    .min(1),
});

const postHandler = async (request: NextRequest) => {
  const { name, description, items }: z.infer<typeof modelSchema> =
    await request.json();

  const model = await prisma.model.create({
    data: {
      name,
      description,
    },
  });

  const findItems = await prisma.item.findMany({
    where: {
      name: {
        in: items.map((item) => item.name.trim()),
      },
    },
  });

  const itemIds = findItems.map(({ id }) => id);

  const filterItemNames = items.filter(
    (item) =>
      !findItems.some((findItem) => item.name.trim() === findItem.name.trim()),
  );

  if (filterItemNames.length > 0) {
    const createdItems = await prisma.item.createManyAndReturn({
      data: filterItemNames,
      select: {
        id: true,
      },
    });

    createdItems.forEach(({ id }) => itemIds.push(id));
  }

  await prisma.modelItems.createMany({
    data: itemIds.map((itemId) => ({
      item_id: itemId,
      order: 1,
      model_id: model.id,
    })),
  });

  return Response.json(model);
};

export const GET = withMiddlewares(
  [authMiddleware, authorization("admin")],
  getHandler,
);

export const POST = withMiddlewares(
  [authMiddleware, validation(modelSchema)],
  postHandler,
);

import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { validation } from "@/utils/validate";
import { NextRequest } from "next/server";
import { z } from "zod";
import { modelSchema } from "../route";

export async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const model = await prisma.model.findFirst({
    where: { id: id },
    include: {
      modelItems: {
        include: {
          item: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return Response.json(model);
}

export const putHandler = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const { name, description, items }: z.infer<typeof modelSchema> =
    await request.json();

  const model = await prisma.model.update({
    where: { id },
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

  await prisma.modelItems.deleteMany({
    where: {
      model_id: id,
    },
  });

  await prisma.modelItems.createMany({
    data: itemIds.map((itemId) => ({
      item_id: itemId,
      order: 1,
      model_id: model.id,
    })),
  });

  return Response.json(model);
};

export const GET = withMiddlewares([authMiddleware], getHandler);

export const PUT = withMiddlewares(
  [authMiddleware, validation(modelSchema)],
  putHandler,
);

"use server";
import { prisma } from "@/lib/prisma";

export const createModel = async (values: {
  name: string;
  description?: string;
  items: { name: string }[];
}) => {
  const { name, description, items } = values;

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

  return true;
};

import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

async function getHandler() {
  const items = await prisma.item.findMany({
    where: {
      level: 0,
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(items);
}

export const GET = withMiddlewares([authMiddleware], getHandler);

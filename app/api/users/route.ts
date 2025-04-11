import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

async function getHandler() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      is_active: true,
    },
  });

  return Response.json(users);
}

export const GET = withMiddlewares([authMiddleware], getHandler);

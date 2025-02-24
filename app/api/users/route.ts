import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/auth";
import { withMiddlewares } from "@/utils/handler";

async function getHandler() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(users);
}

export const GET = withMiddlewares([authMiddleware], getHandler);

import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

async function getHandler() {
  const items = await prisma.$queryRaw`
    SELECT 
      MIN(id) AS id, 
      UPPER(name) AS name
    FROM 
      items
    WHERE 
      items.level = 0
    GROUP BY 
      UPPER(name)
    ORDER BY 
      name
    ;
`;

  return Response.json(items);
}

export const GET = withMiddlewares([authMiddleware], getHandler);

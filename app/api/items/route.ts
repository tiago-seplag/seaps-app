import { prisma } from "@/lib/prisma";

export async function GET() {
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

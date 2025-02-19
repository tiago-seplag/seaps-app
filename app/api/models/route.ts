import { prisma } from "@/lib/prisma";

export async function GET() {
  const models = await prisma.model.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(models);
}

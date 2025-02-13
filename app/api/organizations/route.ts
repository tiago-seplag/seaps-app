import { prisma } from "@/lib/prisma";

export async function GET() {
  const organizations = await prisma.organization.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(organizations);
}

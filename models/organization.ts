import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";

export async function getOrganizationsPaginated(page = 1, perPage = 10) {
  const total = await prisma.organization.count();

  const meta = generateMetaPagination(page, perPage, total);

  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          properties: true,
          persons: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: organizations, meta };
}

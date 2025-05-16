import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";

export async function getPropertiesPaginated(page = 1, perPage = 10) {
  const total = await prisma.property.count();

  const meta = generateMetaPagination(page, perPage, total);

  const properties = await prisma.property.findMany({
    include: {
      organization: true,
      person: {
        select: { name: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: properties, meta };
}

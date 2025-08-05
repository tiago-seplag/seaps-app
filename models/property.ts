import { ValidationError } from "@/errors/validation-error";
import { db } from "@/infra/database";
import { prisma } from "@/lib/prisma";
import { generateMetaPagination } from "@/utils/meta-pagination";
import { z } from "zod";

export const propertySchema = z
  .object({
    organization_id: z.string(),
    name: z.string().min(2),
    address: z.string().optional(),
    type: z.enum(["GRANT", "OWN", "RENTED"]),
    person_id: z.string().optional(),
  })
  .strict();

export type PropertySchema = z.infer<typeof propertySchema>;

export async function getPropertiesPaginated(
  page = 1,
  perPage = 10,
  searchParams?: URLSearchParams,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  if (searchParams?.get("organization_id")) {
    filter.organization_id = searchParams.get("organization_id");
  }

  const total = await prisma.property.count({
    where: filter,
  });

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
    where: filter,
    take: meta.per_page,
    skip: (meta.current_page - 1) * meta.per_page,
  });

  return { data: properties, meta };
}

export async function updatePropertyById(id: string, data: PropertySchema) {
  const _property = await getPropertyById(id);

  if (!_property) {
    throw new ValidationError({
      message: "Esse ID de imóvel não existe",
      action: "Verifique se o ID foi passado corretamente",
      statusCode: 404,
    });
  }

  const property = await prisma.property.update({
    data: {
      ...data,
      person_id:
        _property.organization_id !== data.organization_id
          ? null
          : data.person_id,
    },
    where: { id },
  });

  return property;
}

export async function getPropertyById(id: string) {
  const property = await prisma.property.findFirst({
    where: { id },
  });

  return property;
}

async function createProperty(data: PropertySchema) {
  const [property] = await db("properties")
    .insert({
      name: data.name,
      organization_id: data.organization_id,
      address: data.address,
      type: data.type,
      person_id: data.person_id,
    })
    .returning("*");

  return property;
}

const property = {
  createProperty,
};

export default property;

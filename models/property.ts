/* eslint-disable @typescript-eslint/no-explicit-any */
import person from "./persons";
import { db } from "@/infra/database";
import { z } from "zod";
import { NotFoundError, ValidationError } from "@/infra/errors";

export const propertySchema = z
  .object({
    organization_id: z.string(),
    name: z.string().min(2),
    address: z.string().optional(),
    type: z.enum(["GRANT", "OWN", "RENTED"]),
    cep: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    street: z.string().optional(),
    coordinates: z.string().optional(),
  })
  .strict();

export type PropertySchema = z.infer<typeof propertySchema>;

async function paginated(options: any) {
  const properties = await db("properties")
    .select("properties.*")
    .select("persons.name as person:name")
    .select(
      "organizations.id as organization:id",
      "organizations.name as organization:name",
      "organizations.acronym as organization:acronym",
    )
    .innerJoin(
      "organizations",
      "properties.organization_id",
      "organizations.id",
    )
    .leftJoin("persons", "properties.person_id", "persons.id")
    .where((query) => {
      if (options.organizationId) {
        query.where("organization_id", options.organizationId);
      }
      if (options.created_by) {
        query.where("created_by", options.created_by);
      }

      query.where("properties.is_deleted", false);
    })
    .orderBy("created_at", "desc")
    .paginate(options.page, options.per_page, {
      nest: true,
    });

  return properties;
}

export async function update(id: string, data: PropertySchema) {
  const _property = await findById(id);

  if (!_property) {
    throw new NotFoundError({
      message: "Esse ID de imóvel não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  const updateData = {
    ...data,
    cep: data.cep?.trim().replace(/[^0-9]/g, ""),
    name_normalized: normalizeName(data.name),
  };

  const updatedProperty = await db("properties")
    .where({ id })
    .update(updateData)
    .returning("*");

  return updatedProperty;
}

export async function updatePerson(
  propertyId: string,
  personId: string | null,
) {
  const _property = await findById(propertyId);

  if (!_property) {
    throw new NotFoundError({
      message: "Esse ID de imóvel não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  if (personId) {
    const _person = await person.getPersonById(personId);

    if (personId && !_person) {
      throw new NotFoundError({
        message: "Esse ID de pessoa não existe",
        action: "Verifique se o ID foi passado corretamente",
      });
    }

    if (_property.organization_id !== _person?.organization_id) {
      throw new ValidationError({
        message: "Essa pessoa não pertence a organização do imóvel",
        action: "Verifique se o ID da organização e da pessoa estão corretos",
      });
    }
  }

  const updatedProperty = await db("properties")
    .where({ id: propertyId })
    .update({ person_id: personId })
    .returning("*");

  return updatedProperty;
}

async function findById(id: string) {
  const property = await db("properties").where({ id }).first();

  return property;
}

async function findByName(name: string) {
  const property = await db("properties")
    .select("properties.id", "properties.name")
    .where("name_normalized", normalizeName(name))
    .first();

  return property;
}

async function create(data: PropertySchema, userId?: string) {
  const normalize = normalizeName(data.name);

  const [property] = await db("properties")
    .insert({
      ...data,
      name: data.name.trim().toUpperCase(),
      address: data.address?.trim().toUpperCase(),
      created_by: userId,
      cep: data.cep?.trim().replace(/[^0-9]/g, ""),
      name_normalized: normalize,
    })
    .returning("*");

  return property;
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

async function _delete(id: string) {
  const findedProperty = await findById(id);

  if (!findedProperty) {
    throw new NotFoundError({
      message: "Esse ID de imóvel não existe",
      action: "Verifique se o ID foi passado corretamente",
    });
  }

  await db("properties").where({ id }).update({ is_deleted: true });
}

const property = {
  create,
  updatePerson,
  findById,
  update,
  paginated,
  findByName,
  delete: _delete,
};

export default property;

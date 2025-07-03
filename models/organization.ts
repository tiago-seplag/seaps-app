import { db } from "@/infra/database";

export async function getOrganizationsPaginated(page = 1, perPage = 10) {
  const organizations = await db("organizations")
    .orderBy("name", "asc")
    .paginate(page, perPage);

  return organizations;
}

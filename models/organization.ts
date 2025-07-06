import { db } from "@/infra/database";

export async function paginatedOrganizations(page = 1, perPage = 10) {
  const organizations = await db("organizations")
    .select("organizations.*")
    .orderBy("organizations.acronym", "asc")
    .paginate(page, perPage);

  return organizations;
}

const organization = {
  paginated: paginatedOrganizations,
};

export default organization;

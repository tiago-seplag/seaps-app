import controller, { handler } from "@/infra/controller";
import { getCountByRange, getOrganizationsIGM } from "@/models/dashboard";

async function getHandler() {
  const ranges = await getCountByRange();

  const irm = await getOrganizationsIGM();

  return Response.json({ ranges, irm });
}

export const GET = handler([controller.authenticate], getHandler);

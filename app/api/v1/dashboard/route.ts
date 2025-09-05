import controller, { handler } from "@/infra/controller";
import dashboard from "@/models/dashboard";

async function getHandler() {
  const ranges = await dashboard.getCountByRange();

  const irm = await dashboard.getOrganizationsIGM();

  const properties = await dashboard.properties();

  return Response.json({ ranges, irm, properties });
}

export const GET = handler([controller.authenticate], getHandler);

import controller, { handler } from "@/infra/controller";
import dashboard from "@/models/dashboard";

async function getHandler() {
  // const irm = await dashboard.getOrganizationsIGM();

  const ranges = await dashboard.getCountByRange();

  const properties = await dashboard.properties();

  const inspected = await dashboard.inspected();

  const checklists = await dashboard.checklists();

  return Response.json({ ranges, properties, checklists, inspected });
}

export const GET = handler([controller.authenticate], getHandler);

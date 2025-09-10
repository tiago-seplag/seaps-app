import controller, { handler } from "@/infra/controller";
import { db } from "@/infra/database";

async function getHandler() {
  const results = await db("properties")
    .groupBy("city")
    .select("city")
    .whereNot("city", null)

  return Response.json(results);
}

export const GET = handler([controller.authenticate], getHandler);

import controller, { handler } from "@/infra/controller";
import { db } from "@/infra/database";

async function getHandler() {
  const results = await db.raw(`
    SELECT 
      id, 
      UPPER(name) AS name
    FROM 
      items
    GROUP BY 
      id,
      UPPER(name)
    ORDER BY 
      name
    ; 
  `);

  return Response.json(results.rows);
}

export const GET = handler([controller.authenticate], getHandler);

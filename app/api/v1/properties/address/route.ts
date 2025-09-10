import controller, { handler } from "@/infra/controller";
import { db } from "@/infra/database";

function extractCEP(texto: string) {
  const match = texto.match(/\b\d{5}-?\d{3}\b/);
  return match ? match[0].replace("-", "") : null;
}

async function getHandler() {
  const results = await db("properties")
    .select("*")
    .orderBy("created_at", "desc")
    .limit(100);

  results.forEach((property) => {
    property.cep = extractCEP(property.address);
  });

  const properties = results.filter((property) => property.cep !== null);

  return Response.json(properties);
}

export const GET = handler([controller.authenticate], getHandler);

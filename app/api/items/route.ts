import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const property_id = searchParams.get("property_id");
  const item_id = searchParams.get("item_id");

  if (property_id) {
    const items = await prisma.item.findMany({
      where: {
        property_id: property_id,
        item_id: null,
      },
    });
    return Response.json(items);
  }
  if (item_id) {
    const items = await prisma.item.findMany({
      where: { item_id: item_id },
    });
    return Response.json(items);
  }

  return Response.error();
}

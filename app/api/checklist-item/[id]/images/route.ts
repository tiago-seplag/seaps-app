import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();

  const images = data.images;

  await prisma.checklistItems.update({
    data: {
      image: images[0],
    },
    where: {
      id,
    },
  });

  await prisma.checklistItemImages.createMany({
    data: images.map((image: string) => ({
      checklist_item_id: id,
      image: image,
    })),
  });

  return Response.json({ ok: "ok" });
}

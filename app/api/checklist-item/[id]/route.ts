import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();

  await prisma.checklistItems.update({
    data: {
      score: Number(data.score) ?? Number(data.score),
      observation: data.observation ?? data.observation,
    },
    where: {
      id,
    },
  });

  return Response.json({ ok: "ok" });
}

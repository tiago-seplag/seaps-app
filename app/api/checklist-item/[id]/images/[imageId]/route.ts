import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";

async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { imageId } = await params;
  const data = await request.json();

  const observation = data.observation;

  const updatedImage = await prisma.checklistItemImages.update({
    data: {
      observation,
    },
    where: {
      id: imageId,
    },
  });

  return Response.json(updatedImage);
}

export const PUT = withMiddlewares([authMiddleware], putHandler);

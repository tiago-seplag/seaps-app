import { ValidationError } from "@/errors/validation-error";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";

const getHandler = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: id },
      include: {
        property: {
          include: {
            person: true,
            organization: true,
          },
        },
        organization: true,
        person: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!checklist) {
      throw new ValidationError({
        message: "Esse ID de checklist não existe",
        action: "Verifique se o ID foi passado corretamente",
        statusCode: 404,
      });
    }

    return Response.json(checklist);
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
};

export const GET = withMiddlewares([authMiddleware], getHandler);

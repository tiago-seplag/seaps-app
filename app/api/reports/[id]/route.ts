import { ValidationError } from "@/errors/validation-error";
import { getChecklistById } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";
import axios from "axios";

async function getHandler(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const checklist = await getChecklistById(id);

    const response = await axios.post(
      process.env.REPORT_URL + "/reports/checklist?id=" + id,
      checklist,
      {
        responseType: "blob",
      },
    );

    if (response.status !== 200) {
      return new Response(response.data);
    }

    return Response.json({ error: `unknown error` }, { status: 500 });
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const GET = withMiddlewares([authMiddleware], getHandler);

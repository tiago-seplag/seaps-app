import { ValidationError } from "@/errors/validation-error";
import { getChecklistById } from "@/models/checklist";
import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { NextRequest } from "next/server";
import pdf from "html-pdf";
import axios from "axios";

function createPdfAsync(html: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pdf
      .create(html, {
        type: "pdf",
        format: "A4",
        orientation: "portrait",
      })
      .toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
  });
}

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

    const buffer = await createPdfAsync(response.data);

    if (response.status !== 200) {
      return new Response(buffer);
    }

    return Response.json({ error: `unknown error` }, { status: 500 });
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const GET = withMiddlewares([authMiddleware], getHandler);

import { ValidationError } from "@/errors/validation-error";
import { getChecklistById } from "@/models/checklist";
import { NextRequest } from "next/server";
import axios from "axios";
import controller, { handler } from "@/infra/controller";

async function getHandler(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const checklist = await getChecklistById(id);

    const response = await axios.post(
      process.env.REPORT_URL + "?id=" + id,
      checklist,
      { responseType: "arraybuffer" },
    );

    if (response.status !== 200) {
      return Response.json(
        { error: "Erro ao gerar o PDF" },
        { status: response.status },
      );
    }

    const body = Buffer.from(response.data, "binary");

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=300",
        "Content-Disposition": "inline; filename=generated.pdf",
      },
    });
  } catch (error) {
    if (error instanceof ValidationError)
      return Response.json(error, { status: error.statusCode });
    return Response.json({ error }, { status: 500 });
  }
}

export const GET = handler([controller.authenticate], getHandler);

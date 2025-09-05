import { NextRequest } from "next/server";
import controller, { handler } from "@/infra/controller";
import checklist from "@/models/checklist";
import axios from "axios";
import checklistItem from "@/models/checklist-item";

async function getHandler(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const _checklist = await checklist.getChecklistById(id);

  const checklistItems = await checklist.getChecklistItems(id);

  const items = [];

  for (const _checklistItem of checklistItems) {
    const item = await checklistItem.findById(_checklistItem.id);

    items.push(item);
  }

  const response = await axios.post(
    process.env.REPORT_URL + "?id=" + id,
    { ..._checklist, items },
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
}

export const GET = handler([controller.authenticate], getHandler);

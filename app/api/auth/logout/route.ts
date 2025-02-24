import { authMiddleware } from "@/utils/authentication";
import { withMiddlewares } from "@/utils/handler";
import { cookies } from "next/headers";

async function postHandler() {
  const cookieStore = await cookies();
  cookieStore.delete("MT_ID_SESSION");
  cookieStore.delete("SESSION");
  cookieStore.delete("USER_DATA");

  return Response.json({}, { status: 200 });
}

export const POST = withMiddlewares([authMiddleware], postHandler);

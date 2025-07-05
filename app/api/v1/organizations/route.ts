import { controller } from "@/infra/controller";
import { UnauthorizedError } from "@/infra/errors";
import { getOrganizationsPaginated } from "@/models/organization";
import { NextRequest } from "next/server";

async function getHandler(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const perPage = Number(request.nextUrl.searchParams.get("per_page") || 10);

  const organizations = await getOrganizationsPaginated(page, perPage);

  return Response.json(organizations);
}

export const GET = controller(
  [
    (req: NextRequest) => {
      if (!req.cookies.get("session")?.value) {
        throw new UnauthorizedError({
          message: "You are not authorized to access this resource.",
          action: "Please log in to continue.",
        });
      }
    },
  ],
  getHandler,
);

// export async function GET(request: NextRequest, ctx: RequestContext) {
//   return router.run(request, ctx);
// }

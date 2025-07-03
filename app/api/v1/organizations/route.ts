import { controller } from "@/infra/controller";
import { UnauthorizedError } from "@/infra/errors";
import { getOrganizationsPaginated } from "@/models/organization";
import { NextRequest } from "next/server";

async function getHandler() {
  const organizations = await getOrganizationsPaginated(1, 10);

  return Response.json(organizations);
}

export const GET = controller(
  [
    (req: NextRequest) => {
      if (!!req.headers.get("Authorization")) {
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

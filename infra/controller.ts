/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { NextRequest } from "next/server";
import { onErrorHandler } from "./error-handler";

export function controller(middlewares: Function[], handler: Function) {
  return async (req: NextRequest, ctx?: any) => {
    try {
      for (const middleware of middlewares) {
        await middleware(req, ctx);
      }

      return await handler(req, ctx);
    } catch (error) {
      return onErrorHandler(error);
    }
  };
}

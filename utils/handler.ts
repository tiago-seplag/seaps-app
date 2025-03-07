/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { NextApiRequest } from "next";

export function withMiddlewares(middlewares: Function[], handler: Function) {
  return async (req: NextApiRequest, ctx?: any) => {
    for (const middleware of middlewares) {
      const res = await middleware(req, ctx);
      if (res) return res; // Interrompe se um middleware retornar resposta
    }

    return handler(req, ctx);
  };
}

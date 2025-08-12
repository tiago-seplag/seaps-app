/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { validate as uuidValidate } from "uuid";
import { NextRequest } from "next/server";
import { onErrorHandler } from "./error-handler";
import { ForbiddenError, UnauthorizedError, ValidationError } from "./errors";

import { z, ZodError } from "zod";

import session from "@/models/session";

export function handler(middlewares: Function[], handler: Function) {
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

async function authenticate(req: NextRequest) {
  const cookie = req.cookies.get("session");

  if (!cookie?.value) {
    throw new UnauthorizedError({
      message: "Você não está autorizado a acessar este recurso.",
      action: "Por favor, faça login para continuar.",
    });
  }

  const { user, token } = await session.findUserAndToken(cookie.value);

  if (!user || !token) {
    throw new UnauthorizedError({
      message: "Sessão inválida ou expirada.",
      action: "Por favor, faça login novamente.",
    });
  }

  if (new Date(token.expires_at) < new Date()) {
    throw new UnauthorizedError({
      message: "Sessão inválida ou expirada.",
      action: "Por favor, faça login novamente.",
    });
  }

  if (!user.is_active) {
    throw new ForbiddenError({
      message: "Sua conta está inativa.",
      action: "Por favor, entre em contato com o suporte.",
    });
  }

  req.headers.set("x-user-id", user.id);
  req.headers.set("x-user-role", user.role);
  req.headers.set("x-user-permissions", user.permissions?.join(","));
}

function authorize(...guards: string[]) {
  return async (req: NextRequest) => {
    const permissions = req.headers.get("x-user-permissions")?.split(",") || [];

    if (
      !guards.some((p) => permissions.includes(p)) &&
      !permissions.some((p) => p === "*")
    ) {
      throw new ForbiddenError({
        message: "Você não tem permissão para acessar este recurso.",
        action: "Por favor, entre em contato com o suporte.",
      });
    }
  };
}

function pagination(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  const perPage = req.nextUrl.searchParams.get("per_page");

  if (page && isNaN(Number(page))) {
    throw new ValidationError({
      message: "Paginate error: page must be a number.",
      action: "Please provide a valid number for page.",
    });
  }

  if (perPage && isNaN(Number(perPage))) {
    throw new ValidationError({
      message: "Paginate error: per_page must be a number.",
      action: "Please provide a valid number for per_page.",
    });
  }

  if (!perPage) {
    req.nextUrl.searchParams.set("per_page", "10"); // default per_page
  }
}

function validateBody(schema: z.ZodObject<any, any>) {
  return async (request: NextRequest) => {
    const body = await request.clone().json();
    try {
      schema.parse(body);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((issue) => issue.message);
        throw new ValidationError({
          action: "Por favor, corrija os campos informados.",
          messages,
        });
      }
      throw new ValidationError({
        action: "Por favor, corrija os campos informados.",
      });
    }
  };
}

function validateUUID(...ids: string[]) {
  return async (_: NextRequest, ctx?: { params: Promise<any> }) => {
    const params = await ctx?.params;

    for (const id of ids) {
      if (!params[id]) {
        throw new ValidationError({
          message: "É necessário informar um ID.",
          action: "Por favor, forneça um ID válido.",
        });
      }

      if (!uuidValidate(params[id])) {
        throw new ValidationError({
          message: "O ID não é válido.",
          action: "Por favor, forneça um ID válido.",
        });
      }
    }
  };
}

const controller = {
  authenticate,
  authorize,
  pagination,
  validateBody,
  validateUUID,
};

export default controller;

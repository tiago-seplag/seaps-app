/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { NextRequest } from "next/server";
import { onErrorHandler } from "./error-handler";
import { db } from "./database";
import { ForbiddenError, UnauthorizedError, ValidationError } from "./errors";

import { z, ZodError } from "zod";

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
  const token = req.cookies.get("session")?.value;

  if (!token) {
    throw new UnauthorizedError({
      message: "Você não está autorizado a acessar este recurso.",
      action: "Por favor, faça login para continuar.",
    });
  }

  const ahutenticatedUser = await db("users")
    .select("users.*")
    .innerJoin("sessions", "users.id", "sessions.user_id")
    .where("sessions.token", token)
    .first();

  if (!ahutenticatedUser) {
    throw new UnauthorizedError({
      message: "Sessão inválida ou expirada.",
      action: "Por favor, faça login novamente.",
    });
  }

  if (!ahutenticatedUser.is_active) {
    throw new ForbiddenError({
      message: "Sua conta está inativa.",
      action: "Por favor, entre em contato com o suporte.",
    });
  }

  req.headers.set("x-user-id", ahutenticatedUser.id);
  req.headers.set("x-user-role", ahutenticatedUser.role);
}

async function paginateValidation(req: NextRequest) {
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

const controller = {
  authenticate,
  paginateValidation,
  validateBody,
};

export default controller;

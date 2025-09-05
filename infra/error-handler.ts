import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onErrorHandler(error: any) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError
  ) {
    if (error instanceof UnauthorizedError) {
      return Response.json(error, {
        status: error.statusCode,
        headers: {
          "set-cookie": `session=; max-age=0; path=/; HttpOnly; SameSite=Strict`,
        },
      });
    }

    return Response.json(error, { status: error.statusCode });
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  return Response.json(error, { status: 500 });
}

export { onErrorHandler };

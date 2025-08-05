import {
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
    error instanceof UnauthorizedError
  ) {
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

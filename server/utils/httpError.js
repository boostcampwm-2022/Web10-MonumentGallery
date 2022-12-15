import { HTTP_STATUS } from "./constants.js";

class HttpError extends Error {
  name = "HttpError";
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

class UnauthenticatedError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

class ForbiddenError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

class ConflictError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export {
  HttpError,
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};

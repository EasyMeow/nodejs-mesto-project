export const HttpStatusCode = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
} as const;

export const DEFAULT_SERVER_ERROR = 'На сервере произошла ошибка';
export const MONGOOSE_VALIDATION_ERROR = 'ValidationError';
export const MONGOOSE_SERVER_ERROR = 'MongoServerError';

export const HttpStatusCode = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
} as const;

export const DEFAULT_SERVER_ERROR = 'На сервере произошла ошибка';

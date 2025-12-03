import { HttpStatusCode } from '../utils/http-status-codes';

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.BadRequest;
  }
}

export default BadRequestError;

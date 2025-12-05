import { HttpStatusCode } from '../utils/http-status-codes';

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.Forbidden;
  }
}

export default ForbiddenError;

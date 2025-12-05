import { HttpStatusCode } from '../utils/http-status-codes';

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.Unauthorized;
  }
}

export default UnauthorizedError;

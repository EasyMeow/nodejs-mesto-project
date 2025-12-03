import { HttpStatusCode } from '../utils/http-status-codes';

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.NotFound;
  }
}

export default NotFoundError;

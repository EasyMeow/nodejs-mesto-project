import { HttpStatusCode } from '../utils/http-status-codes';

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.Conflict;
  }
}

export default ConflictError;

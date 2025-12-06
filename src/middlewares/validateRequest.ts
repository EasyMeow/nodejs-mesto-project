import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpStatusCode } from '../utils/http-status-codes';

export const headersSchema = z.object({
  authorization: z.string().startsWith('Bearer '),
}).passthrough();

type RequestPart = 'body' | 'query' | 'params' | 'headers';

const validateRequest = (
  schema: z.ZodSchema,
  part: RequestPart,
) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req[part]);
  console.log(req[part]);
  console.log(result);

  if (!result.success) {
    const error = res.status(400).json({
      statusCode: HttpStatusCode.BadRequest,
      error: 'Bad Request',
      message: result.error.issues,
    });

    return next(error);
  }

  return next();
};

export default validateRequest;

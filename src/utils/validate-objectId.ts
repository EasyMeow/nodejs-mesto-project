import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-err';

export const validateObjectId = (_id: string, name: string) => {
  try {
    return new mongoose.Types.ObjectId(_id);
  } catch (err) {
    throw new BadRequestError(`Невалидный ${name}`);
  }
};

export default validateObjectId;

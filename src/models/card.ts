import mongoose, { Schema, Types, model } from 'mongoose';
import { urlRegex } from '../constants';

export interface ICard {
  _id: mongoose.Types.ObjectId;
  name: string;
  link: string;
  owner: Types.ObjectId,
  likes: Types.ObjectId[],
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Невалидная ссылка',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);

import { z } from 'zod';
import { urlRegex } from '../constants';

export const cardIdSchema = z.object({
  cardId: z.string().length(24),
});

export const cardSchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().regex(urlRegex),
});

export const userIdSchema = z.object({
  userId: z.string().length(24),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const fullUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200).optional(),
  avatar: z.string().regex(urlRegex).optional(),
});

export const editUserSchema = z.object({
  name: z.string().min(2).max(30),
  about: z.string().min(2).max(200),
});

export const fullUserSchemaAvatarRequired = z.object({
  avatar: z.string().regex(urlRegex),
});

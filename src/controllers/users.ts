import { Request, Response, NextFunction } from 'express';
import { validateObjectId } from '../utils/validate-objectId';
import { HttpStatusCode } from '../utils/http-status-codes';
import { NotFoundError } from '../errors/not-found-err';
import User, { IUser } from '../models/user';

export const serializeUser = (user: IUser) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => users.map((user) => serializeUser(user)))
    .then((users) => res.send(users))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const objId = validateObjectId(userId, 'userId');

  return User.findById(objId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(serializeUser(user));
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(HttpStatusCode.Created).send(serializeUser(user)))
    .catch(next);
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { $set: { name, about } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(serializeUser(user));
    })
    .catch(next);
};

export const updateUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { $set: { avatar } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(serializeUser(user));
    })
    .catch(next);
};

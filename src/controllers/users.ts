import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateObjectId } from '../utils/validate-objectId';
import { HttpStatusCode, MONGOOSE_VALIDATION_ERROR, MONGOOSE_SERVER_ERROR } from '../utils/http-status-codes';
import { NotFoundError } from '../errors/not-found-err';
import { UnauthorizedError } from '../errors/unauthorized-err';
import { BadRequestError } from '../errors/bad-request-err';
import { ConflictError } from '../errors/conflict-err';
import User, { IUser } from '../models/user';

import { JWT_SECRET } from '../config';

export const serializeUser = (user: IUser) => ({
  _id: user._id,
  email: user.email,
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

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(serializeUser(user));
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(HttpStatusCode.Created).send(serializeUser(user)))
    .catch((err) => {
      console.log(err);
      if (err.name === MONGOOSE_VALIDATION_ERROR) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }

      if (err.name === MONGOOSE_SERVER_ERROR) {
        next(new ConflictError('Email уже существует'));
        return;
      }

      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
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

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let foundUser: IUser;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }

      foundUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неверный email или пароль');
      }

      const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 7);

      res.cookie('token', token, { httpOnly: true, expires: expiresDate }).send({ token });
    })
    .catch(next);
};

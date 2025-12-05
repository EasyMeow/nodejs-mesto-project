import {
  Router, Request, Response, NextFunction,
} from 'express';
import { NotFoundError } from '../errors/not-found-err';
import usersRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default router;

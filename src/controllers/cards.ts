import { Request, Response, NextFunction } from 'express';
import { validateObjectId } from '../utils/validate-objectId';
import { HttpStatusCode } from '../utils/http-status-codes';
import { NotFoundError } from '../errors/not-found-err';
import Card, { ICard } from '../models/card';

export const serializeCard = (card: ICard) => ({
  _id: card._id,
  name: card.name,
  link: card.link,
  owner: card.owner,
  likes: card.likes,
  createdAt: card.createdAt,
});

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate([
      { path: 'owner', select: '_id name about avatar' },
      { path: 'likes', select: '_id name about avatar' },
    ])
    .then((cards) => cards.map((card) => serializeCard(card)))
    .then((cards) => res.send(cards))
    .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId, 'cardId');

  return Card.findByIdAndDelete(objId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.status(HttpStatusCode.NoContent).send({ messsage: 'Пост удалён' });
    })
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(HttpStatusCode.Created).send(serializeCard(card)))
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId, 'cardId');

  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    objId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send(serializeCard(card));
    })
    .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId, 'cardId');

  const userId = req.user._id;

  return Card.findOneAndUpdate(
    objId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send(serializeCard(card));
    })
    .catch(next);
};

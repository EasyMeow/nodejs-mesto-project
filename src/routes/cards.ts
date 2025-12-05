import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { cardSchema, cardIdSchema } from '../middlewares/validation-schemas';
import validateRequest, { headersSchema } from '../middlewares/validateRequest';
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.use(validateRequest(headersSchema, 'headers'), auth);

router.get('/', getCards);
router.post('/', validateRequest(cardSchema, 'body'), createCard);
router.delete('/:cardId', validateRequest(cardIdSchema, 'params'), deleteCardById);
router.put('/:cardId/likes', validateRequest(cardIdSchema, 'params'), likeCard);
router.delete('/:cardId/likes', validateRequest(cardIdSchema, 'params'), dislikeCard);

export default router;

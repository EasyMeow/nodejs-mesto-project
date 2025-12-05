import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  loginSchema, fullUserSchema, userIdSchema, editUserSchema, fullUserSchemaAvatarRequired,
} from '../middlewares/validation-schemas';
import validateRequest, { headersSchema } from '../middlewares/validateRequest';
import {
  login, createUser, getUsers, getUserById, getCurrentUser, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.post('/signin', validateRequest(loginSchema, 'body'), login);
router.post('/signup', validateRequest(fullUserSchema, 'body'), createUser);

router.use(validateRequest(headersSchema, 'headers'), auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateRequest(userIdSchema, 'params'), getUserById);
router.patch('/me', validateRequest(editUserSchema, 'body'), updateUser);
router.patch('/me/avatar', validateRequest(fullUserSchemaAvatarRequired, 'body'), updateUserAvatar);

export default router;

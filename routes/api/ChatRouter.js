import expess from 'express';
import { isAuth } from '../../app/auth/auth.method.js';
import ChatRouter from '../../app/controllers/ChatController.js';

export const router = expess.Router();

router.get('/listUser', isAuth, ChatRouter.getListUser);
router.post('/send', isAuth, ChatRouter.sendMessage);

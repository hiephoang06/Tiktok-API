import expess from 'express';
import { isAuth } from '../../app/auth/auth.method.js';
import CommentController from '../../app/controllers/CommentController.js';
export const router = expess.Router();

router.post('/:id', isAuth, CommentController.postComment);

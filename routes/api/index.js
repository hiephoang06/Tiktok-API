import express from 'express';
import { router as ProfileRouter } from './ProfileRouter.js';
import { router as VideoRouter } from './VideoRouter.js';
import { router as LoginRouter } from './LoginRouter.js';
import { router as CommentRouter } from './CommentRouter.js';
import ProfileController from '../../app/controllers/ProfileController.js';
export const ApiRouters = express.Router();

ApiRouters.use('/profile', ProfileRouter);
ApiRouters.use('/profiles', ProfileController.getProfiles);

ApiRouters.use('/video', VideoRouter);
ApiRouters.use('/login', LoginRouter);
ApiRouters.use('/comment', CommentRouter);

import express from 'express';
import { router as ProfileRouter } from './ProfileRouter.js';
import { router as VideoRouter } from './VideoRouter.js';
export const ApiRouters = express.Router();

ApiRouters.use('/profile', ProfileRouter);
ApiRouters.use('/video', VideoRouter);

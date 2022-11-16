import expess from 'express';
import { isAuth } from '../../app/auth/auth.method.js';
import ProfileController from '../../app/controllers/ProfileController.js';
export const router = expess.Router();

router.get('/', isAuth, ProfileController.getMyProfile);

router.get('/:id', ProfileController.getProfile);

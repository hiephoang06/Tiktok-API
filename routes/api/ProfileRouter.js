import expess from 'express';
import ProfileController from '../../app/controllers/ProfileController.js';
export const router = expess.Router();

router.get('/', ProfileController.getProfiles);
router.get('/:id', ProfileController.getProfile);

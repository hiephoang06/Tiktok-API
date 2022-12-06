import expess from 'express';
import { isAuth } from '../../app/auth/auth.method.js';
import ProfileController from '../../app/controllers/ProfileController.js';
export const router = expess.Router();

router.get('/', isAuth, ProfileController.getMyProfile);
router.get('/following', isAuth, ProfileController.getFollowingAuth);
router.get('/following/:id', ProfileController.getFollowing);
router.get('/follower', isAuth, ProfileController.getFollowerAuth);
router.get('/follower/:id', ProfileController.getFollower);
router.get('/auth/:id', isAuth, ProfileController.getProfileAuth);
router.get('/:id', ProfileController.getProfile);
router.post('/:id', isAuth, ProfileController.followUser);
router.patch('/', isAuth, ProfileController.editProfile);

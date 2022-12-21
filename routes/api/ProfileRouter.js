import expess from 'express';
import { isAuth } from '../../app/auth/auth.method.js';
import multer from 'multer';
import ProfileController from '../../app/controllers/ProfileController.js';
import { fileFilter, storage } from './VideoRouter.js';
export const router = expess.Router();

const upload = multer({ storage, fileFilter });

router.get('/', isAuth, ProfileController.getMyProfile);
router.get('/following', isAuth, ProfileController.getFollowingAuth);
router.get('/following/:id', isAuth, ProfileController.getFollowing);
router.get('/follower', isAuth, ProfileController.getFollowerAuth);
router.get('/follower/:id', isAuth, ProfileController.getFollower);
router.get('/auth/:id', isAuth, ProfileController.getProfileAuth);
router.get('/:id', ProfileController.getProfile);
router.post('/:id', isAuth, ProfileController.followUser);
router.patch('/', isAuth, ProfileController.editProfile);
router.patch('/avatar', isAuth, upload.single('uploaded_file'), ProfileController.editAvatar);

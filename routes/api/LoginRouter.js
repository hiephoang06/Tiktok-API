import expess from 'express';
import passport from 'passport';
import { loginToken, postInfo } from '../../app/auth/auth.method.js';
export const router = expess.Router();

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'public_profile', session: false }));
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/failure'
  }),
  loginToken
);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failure' }), loginToken);

router.post('/', postInfo);
router.get('/failure', (req, res) => {
  res.json({ status: false });
});

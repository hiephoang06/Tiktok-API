import expess from 'express';
import passport from 'passport';
import { loginToken, postInfo } from '../../app/auth/auth.method.js';
import LoginController from '../../app/controllers/LoginController.js';
export const router = expess.Router();


router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'public_profile', session: false }));
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/failure'
  }),
  loginToken
  );
  
  router.get('/success', (req,res)=>{
    if(req.user){
      res.status(200).json({
        error:false,
        message:"Login Successful",
        user:req.user,
      })
    }
  })
  
  router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
  router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: 'http://localhost:3000' ,failureRedirect: '/auth/google/failure' }), loginToken );

  router.post('/', postInfo);
  router.get('/failure', (req, res) => {
    res.json({ status: 401,
      message:"Login fail" });
    });

router.post('/google',LoginController.login)    




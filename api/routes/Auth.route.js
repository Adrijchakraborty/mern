import express from 'express';
import { Google, Signin, Signup, signOut } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',Signup);
router.post('/signin',Signin);
router.post('/google',Google);
router.get('/signout', signOut);

export default router;
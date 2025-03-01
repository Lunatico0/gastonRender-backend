import { Router } from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

export default router;

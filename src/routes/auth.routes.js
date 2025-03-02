import { Router } from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getClients,
  createUser
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getProfile);
router.get("/clients", protect, getClients);
router.post("/create-user", protect, createUser);
router.put("/update-profile", protect, updateProfile);


export default router;

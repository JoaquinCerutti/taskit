import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getProfile } from '../controllers/profileController.js';

const router = Router();

router.get('/', verifyToken, getProfile); // /api/profile

export default router;

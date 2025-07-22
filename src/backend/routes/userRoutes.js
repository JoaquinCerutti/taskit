import { Router } from 'express';
import { createUser } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser); // /api/users

export default router;

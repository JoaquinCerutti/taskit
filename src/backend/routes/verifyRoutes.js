import { Router } from 'express';
import { verifyEmail } from '../controllers/verifyController.js';

const router = Router();

router.get('/', verifyEmail); // Esto hace que funcione con ?token=...

export default router;

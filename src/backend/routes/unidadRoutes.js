import express from 'express';
import { getUnidades } from '../controllers/unidadController.js';

const router = express.Router();

router.get('/', getUnidades);

export default router;

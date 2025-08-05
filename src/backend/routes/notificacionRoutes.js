import { Router } from 'express';
import {
  getNotificacionesUsuario,
  marcarComoLeida,
  marcarTodasComoLeidas
} from '../controllers/notificacionController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// 👇 corregido
router.get('/', verifyToken, getNotificacionesUsuario);
router.patch('/:id/leida', verifyToken, marcarComoLeida);
router.patch('/todas/leidas', verifyToken, marcarTodasComoLeidas);

export default router;

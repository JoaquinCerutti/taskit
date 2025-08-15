import { Router } from 'express';
import {
  getNovedades,
  getNovedadById,
  createNovedad,
  updateNovedad,
  deleteNovedad,
} from '../controllers/novedadController.js';

const router = Router();

router.get('/', getNovedades);
router.get('/:id', getNovedadById);
router.post('/', createNovedad);
router.put('/:id', updateNovedad);
router.delete('/:id', deleteNovedad);

export default router;

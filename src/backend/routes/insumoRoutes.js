import express from 'express';
import {
  createInsumo,
  getInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo
} from '../controllers/insumoController.js';

const router = express.Router();

router.post('/', createInsumo);
router.get('/', getInsumos);
router.get('/:id', getInsumoById); // <-- este es el importante
router.put('/:id', updateInsumo);
router.delete('/:id', deleteInsumo);

export default router;

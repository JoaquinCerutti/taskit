import express from 'express';
import {
  createInsumo,
  getInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
  darDeBajaInsumo,
  darDeAltaInsumo
} from '../controllers/insumoController.js';

const router = express.Router();

router.post('/', createInsumo);
router.get('/', getInsumos);
router.get('/:id', getInsumoById); 
router.put('/:id', updateInsumo);
router.delete('/:id', deleteInsumo);
router.patch('/:id/dar-de-baja', darDeBajaInsumo);
router.patch('/:id/dar-de-alta', darDeAltaInsumo);

export default router;

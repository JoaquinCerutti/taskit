import express from 'express';
import {
  createInsumo,
  getInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
  darDeBajaInsumo,
  darDeAltaInsumo,
  actualizarStockMasivo
} from '../controllers/insumoController.js';

const router = express.Router();

router.post('/', createInsumo);
router.get('/', getInsumos);

router.delete('/:id', deleteInsumo);
router.patch('/:id/dar-de-baja', darDeBajaInsumo);
router.patch('/:id/dar-de-alta', darDeAltaInsumo);
router.put('/actualizar-stock-masivo', actualizarStockMasivo);
router.put('/:id', updateInsumo);
router.get('/:id', getInsumoById); 


export default router;

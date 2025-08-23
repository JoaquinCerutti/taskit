import { Router } from 'express';
import {
  getNovedades,
  getNovedadById,
  createNovedad,
  updateNovedad,
  deleteNovedad,
  getCategoriasNovedad, // <-- importar el nuevo controlador
  marcarNovedadLeida,
  getLectoresNovedad,
} from '../controllers/novedadController.js';

const router = Router();

router.get('/categorias-novedad', getCategoriasNovedad); // <-- agregar esta línea
router.get('/', getNovedades);
router.get('/:id', getNovedadById);
router.post('/', createNovedad);
router.put('/:id', updateNovedad);
router.delete('/:id', deleteNovedad);
router.post('/:id/leida', marcarNovedadLeida); // Marcar como leída
router.get('/:id/lectores', getLectoresNovedad); // Obtener lectores

export default router;

import { Router } from 'express';
import {
  getNovedades,
  getNovedadById,
  createNovedad,
  updateNovedad,
  deleteNovedad,
  getCategoriasNovedad, // <-- importar el nuevo controlador
} from '../controllers/novedadController.js';

const router = Router();

router.get('/categorias-novedad', getCategoriasNovedad); // <-- agregar esta línea
router.get('/', getNovedades);
router.get('/:id', getNovedadById);
router.post('/', createNovedad);
router.put('/:id', updateNovedad);
router.delete('/:id', deleteNovedad);

export default router;

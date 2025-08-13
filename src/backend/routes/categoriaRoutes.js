import express from 'express';
import { getCategorias, createCategoria } from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', getCategorias);
router.post('/', createCategoria); // <-- esta línea nueva

export default router;

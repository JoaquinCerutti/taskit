import { Router } from 'express';
import { createUser } from '../controllers/userController.js';
import { validateUser } from '../middlewares/validateUser.js';
import { validationResult } from 'express-validator';

const router = Router();

router.post('/', validateUser, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve todos los errores validados
    return res.status(400).json({ errors: errors.array() });
  }
  createUser(req, res);
});

export default router;

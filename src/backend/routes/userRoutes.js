import { Router } from 'express';
import { createUser, getAllUsers, getUserById } from '../controllers/userController.js';
import { validateUser } from '../middlewares/validateUser.js';
import { validationResult } from 'express-validator';
import { updateUserById } from '../controllers/userController.js';
import { updateRolUsuario } from '../controllers/userController.js';


const router = Router();

// GET: Todos los usuarios
router.get('/', getAllUsers);

// GET: Usuario por ID
router.get('/by-id/:id', getUserById);



router.put('/:id', updateUserById);

// POST: Crear nuevo usuario
router.post('/', validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createUser(req, res);
});

router.put('/:id/rol', updateRolUsuario);



export default router;

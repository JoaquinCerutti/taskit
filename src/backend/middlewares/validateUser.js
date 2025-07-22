// middlewares/validateUser.js
import { body } from 'express-validator';

export const validateUser = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),

  body('documento')
    .notEmpty().withMessage('El documento es obligatorio')
    .isNumeric().withMessage('Debe contener sólo números')
    .isLength({ min: 7, max: 8 }).withMessage('Debe tener 7 u 8 dígitos'),

  body('direccion')
    .notEmpty().withMessage('La dirección es obligatoria'),

  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^[0-9()+\s-]{7,15}$/).withMessage('Formato de teléfono inválido'),

  body('emailCorporativo')
    .notEmpty().withMessage('El email corporativo es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),

  body('emailPersonal')
    .notEmpty().withMessage('El email personal es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),

  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('Debe tener al menos 8 caracteres'),

  body('genero')
    .notEmpty().withMessage('El género es obligatorio')
    .isIn(['HOMBRE', 'MUJER', 'OTRO']).withMessage('Valor inválido'),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio'),
];

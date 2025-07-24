import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { PORT } from './config.js';
import insumoRoutes from './routes/insumoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import unidadRoutes from './routes/unidadRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import insumosRoutes from './routes/insumoRoutes.js';




dotenv.config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Rutas
app.get('/', (req, res) => {
  res.send('API funcionando');
});
app.use('/api/users', userRoutes); // Registro de usuario
app.use('/api/auth', authRoutes);  // Login
app.use('/api/profile', profileRoutes); // Perfil del usuario con su información
app.use('/api/verify', verifyRoutes); // Verificar mail del user
app.use('/api/password', passwordRoutes); // Ruta que administra reestablecimiento de contraseñas
app.use('/api/insumos', insumoRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/insumos', insumosRoutes);


// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));



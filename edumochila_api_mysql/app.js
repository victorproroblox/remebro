import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { testConnection } from './config/database.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

import productoRoutes from './routes/producto.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import catalogoRoutes from './routes/catalogo.routes.js';
import productoUsRoutes from './routes/productoUs.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import codigosRoutes from './routes/codigos.routes.js';
import estadosRoutes from './routes/estados.routes.js';
import alumnosRoutes from './routes/alumnos.routes.js';
import authRoutes from './routes/auth.routes.js';
import googleRoutes from './routes/auth.google.routes.js';

const app = express();

/* ---------------- CORS: permitir TODO (solo para test) ---------------- */
app.use(cors());              // <= permite cualquier origin y headers
app.options('*', cors());     // <= atiende preflight en cualquier ruta
/* --------------------------------------------------------------------- */

/* ------------------------------ MIDDLEWARES ---------------------------- */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* --------------------------------- RUTAS -------------------------------- */
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/user-product', productoUsRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api', alumnosRoutes);

/* --------------------------------- 404 & ERR --------------------------- */
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

/* --------------------------------- ARRANQUE ----------------------------- */
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 API MySQL lista en http://localhost:${port}`);
});

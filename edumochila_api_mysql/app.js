import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { testConnection } from './config/database.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import googleRoutes from './routes/auth.google.routes.js';
import productoRoutes from './routes/producto.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import catalogoRoutes from './routes/catalogo.routes.js';
import productoUsRoutes from './routes/productoUs.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

const app = express();

// Middlewares base
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(passport.initialize()); 

// Rutas
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/user-product', productoUsRoutes);
app.use('/api/ventas', ventasRoutes);


// 404
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Error handler
app.use(errorHandler);

// Arranque
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 API MySQL lista en http://localhost:${port}`);
});

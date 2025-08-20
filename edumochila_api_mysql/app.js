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

const app = express();

/* ----------------------------- CORS CONFIG ----------------------------- */
// Si ALLOWED_ORIGINS no viene, usa localhost y tu dominio de Render.
const corsDefaults = 'http://localhost:3000,https://edumochila-web.onrender.com';
const allowList = (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.trim().length > 0
  ? process.env.ALLOWED_ORIGINS
  : corsDefaults
).split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);              // permite requests sin Origin (curl/health)
    if (allowList.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Ya no usamos JWT, así que no necesitas 'Authorization' aquí
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false,
  optionsSuccessStatus: 204,
};
/* ---------------------------------------------------------------------- */

/* ------------------------------ MIDDLEWARES ---------------------------- */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // preflight

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
/* ---------------------------------------------------------------------- */

/* --------------------------------- RUTAS -------------------------------- */
app.use('/api', healthRoutes);

// SIN JWT / SIN PASSPORT (se retiraron authRoutes y googleRoutes)
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/user-product', productoUsRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api', alumnosRoutes);
/* ----------------------------------------------------------------------- */

// 404
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Error handler
app.use(errorHandler);

/* --------------------------------- ARRANQUE ----------------------------- */
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 API MySQL lista en http://localhost:${port}`);
});

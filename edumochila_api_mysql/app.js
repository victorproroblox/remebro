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
import codigosRoutes from './routes/codigos.routes.js';
import estadosRoutes from "./routes/estados.routes.js";

const app = express();

/* ----------------------------- CORS CONFIG ----------------------------- */
// Orígenes permitidos (separados por coma). Ej:
// ALLOWED_ORIGINS=http://localhost:3000,https://mi-web.onrender.com
const allowList = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000', 'https://edumochila-web.onrender.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Misma config para app.use(cors()) y para app.options('*', cors(...))
const corsOptions = {
  origin(origin, cb) {
    // Permite peticiones sin Origin (curl, health checks, etc.)
    if (!origin) return cb(null, true);
    if (allowList.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,            // déjalo en false si NO usas cookies/sesiones
  optionsSuccessStatus: 204,     // responde OK en preflight
};
/* ---------------------------------------------------------------------- */

/* ------------------------------ MIDDLEWARES ---------------------------- */
app.use(
  helmet({
    // Evita bloqueos de recursos de otros orígenes si en algún momento sirves imágenes u otros assets
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));      // Manejo explícito del preflight

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(passport.initialize());
/* ---------------------------------------------------------------------- */

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
app.use("/api/estados", estadosRoutes);


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

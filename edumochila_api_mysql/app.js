// app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from "passport";
import session from "express-session";

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
import reportesRoutes from './routes/reportes.routes.js';

const app = express();

/* -------------------------- Opciones de CORS --------------------------- */
// Permite definir orígenes por .env: CORS_ORIGINS=dom1,dom2

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const fallbackOrigins = [
  'https://edumochila-web.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'exp://127.0.0.1:19000'
];

const allowedOrigins = envOrigins.length ? envOrigins : fallbackOrigins;
const allowCredentials = String(process.env.CORS_CREDENTIALS || 'false') === 'true';

/* ----------------- Preflight handler (antes de TODO) ------------------- */
/** Responde OPTIONS y asegura headers CORS incluso en 404/errores */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Si el request trae Origin y está permitido, refléjalo; si no, no pongas header
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (allowCredentials) res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------------------------- cors() formal ---------------------------- */
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);            // Postman/cURL
    return cb(null, allowedOrigins.includes(origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: allowCredentials,
  optionsSuccessStatus: 204
}));

/* ------------------------------ MIDDLEWARES ---------------------------- */
app.set('trust proxy', 1); // Render/Proxies
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
app.use('/api/reportes', reportesRoutes);


app.use(session({
  secret: process.env.SESSION_SECRET || "cambia_esto",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // en prod detrás de HTTPS: true
}));

// 2) Inicializa passport
app.use(passport.initialize());
// (si usaras sesiones de passport, también: app.use(passport.session()))

// 3) Monta rutas DESPUÉS
import authGoogleRoutes from "./routes/auth.google.routes.js";
app.use("/api/auth", authGoogleRoutes);


/* --------------------------------- 404 & ERR --------------------------- */
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

/* --------------------------------- ARRANQUE ----------------------------- */
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 API MySQL lista en http://localhost:${port}`);
  console.log(`[CORS] origins permitidos: ${allowedOrigins.join(', ') || '(ninguno)'}`);
  console.log(`[CORS] credentials: ${allowCredentials}`);
});

export default app;

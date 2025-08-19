// app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';

// 🔀 Ajusta estas rutas si tus archivos se llaman diferente
import healthRoutes from './routes/health.routes.js';
import ubicacionesRoutes from './routes/ubicaciones.routes.js';

const app = express();

/* ========================
   C O R S   C O N F I G
   ======================== */
const allowedOrigins = [
  'http://localhost:3000',
  'https://edumochila-web.onrender.com',
];

const corsOptions = {
  origin: (origin, cb) => {
    // Permite llamadas sin origin (curl/Postman) y las de la lista
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS: origin no permitido'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // ponlo en true sólo si usas cookies/sesiones
  maxAge: 86400,      // cache del preflight (1 día)
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

/* ========================
   M I D D L E W A R E S
   ======================== */
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

/* ========================
   R U T A S
   ======================== */
app.use('/api/health', healthRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);

/* ========================
   4 0 4  &  E R R O R E S
   ======================== */
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Error handler simple (si ya tienes uno propio, usa ese)
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err?.message || err);
  const status = err.status || 500;
  res.status(status).json({
    message: err?.message || 'Error en el servidor',
  });
});

/* ========================
   M O N G O   C O N N
   ======================== */
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const MONGO_DB  = process.env.MONGODB_DB  || process.env.MONGO_DB || 'mochila_iot';

async function start() {
  try {
    if (!MONGO_URI) {
      throw new Error('Falta MONGODB_URI en variables de entorno');
    }

    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB,
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ Conectado a MongoDB (db: ${MONGO_DB})`);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 API Mongo escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar API Mongo:', err.message);
    process.exit(1);
  }
}

start();

export default app;

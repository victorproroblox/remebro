import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectMongo } from './config/mongo.js';
import horarioRoutes from './routes/horario.routes.js';
import mensajesRoutes from './routes/mensajes.routes.js';
import pesoRoutes from './routes/peso.routes.js';
import ubicacionRoutes from './routes/ubicacion.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'edumochila-api-mongo' }));
app.use('/api/horario', horarioRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/pesos', pesoRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/api/productos', productRoutes);


app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await connectMongo();
  console.log(`🚀 API Mongo lista en http://localhost:${port}`);
});

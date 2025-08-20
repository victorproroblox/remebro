import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectMongo } from "./config/mongo.js";
import { authGuard } from "./middlewares/authGuard.js";

import horarioRoutes from "./routes/horario.routes.js";
import mensajesRoutes from "./routes/mensajes.routes.js";
import pesoRoutes from "./routes/peso.routes.js";
import ubicacionRoutes from "./routes/ubicacion.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

/* ============ CORS ============ */
const allowedOrigins = [
  "http://localhost:3000",
  "https://edumochila-web.onrender.com",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: origin no permitido"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  maxAge: 86400,
};

app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

/* ============ Rutas ============ */
// Pública
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "edumochila-api-mongo" })
);

// Protegidas (requieren JWT válido emitido por la API MySQL)
app.use("/api/horario", authGuard, horarioRoutes);
app.use("/api/mensajes", authGuard, mensajesRoutes);
app.use("/api/pesos", authGuard, pesoRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);
app.use("/api/productos", authGuard, productRoutes);

/* ============ 404 ============ */
app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

/* ============ Arranque ============ */
const port = process.env.PORT || 4001;

app.listen(port, async () => {
  await connectMongo();
  console.log(`🚀 API Mongo lista en http://localhost:${port}`);
});

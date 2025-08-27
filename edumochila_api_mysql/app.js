import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";

// 👉 REGISTRA LA ESTRATEGIA ANTES DE RUTAS
import "./middlewares/google.strategy.js";

import { testConnection } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import catalogoRoutes from "./routes/catalogo.routes.js";
import productoUsRoutes from "./routes/productoUs.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import codigosRoutes from "./routes/codigos.routes.js";
import estadosRoutes from "./routes/estados.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleRoutes from "./routes/auth.google.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";

const app = express();

/* ---------------------- CORS básico (con credenciales) ----------------- */
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);
const allowedOrigins = envOrigins.length
  ? envOrigins
  : ["https://edumochila-web.onrender.com","http://localhost:3000","http://127.0.0.1:3000"];
app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(null, false),
  credentials: true,
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ------------------------------ Sesión + Passport ---------------------- */
app.use(session({
  secret: process.env.SESSION_SECRET || "cambia_esto",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,          // Render usa HTTPS
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use(passport.initialize());
// app.use(passport.session()); // solo si serializas usuarios

// LOG de verificación
console.log("[app] estrategia google presente? ->", !!passport._strategies?.google);

/* --------------------------------- Rutas ------------------------------- */
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/user-product", productoUsRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/codigos", codigosRoutes);
app.use("/api/estados", estadosRoutes);
app.use("/api", alumnosRoutes);
app.use("/api/reportes", reportesRoutes);

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

app.use(errorHandler);

console.log("[app] estrategia google presente? ->", !!passport._strategies?.google);

/* --------------------------------- Arranque ---------------------------- */
const port = process.env.PORT || 4000;
app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 API MySQL lista en http://localhost:${port}`);
  console.log(`[CORS] origins: ${allowedOrigins.join(", ")}`);
});
export default app;

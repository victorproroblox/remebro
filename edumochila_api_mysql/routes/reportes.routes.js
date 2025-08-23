// src/routes/reportes.routes.js
import { Router } from 'express';
import {
  reporteVentas,
  reporteProductos,
  reporteUsuarios,
  reporteCodigos,
} from '../controllers/reportes.controller.js';

const router = Router();

// GET /api/reportes/ventas?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=200&offset=0
router.get('/ventas', reporteVentas);

// GET /api/reportes/productos
router.get('/productos', reporteProductos);

// GET /api/reportes/usuarios
router.get('/usuarios', reporteUsuarios);

// (opcional) GET /api/reportes/codigos
router.get('/codigos', reporteCodigos);

export default router;

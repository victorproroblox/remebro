// src/routes/codigos.routes.js
import { Router } from 'express';
import { ultimoCodigo, listarCodigos, misCodigosPorUsuario } from '../controllers/codigos.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js'; // ajusta el nombre si es distinto

const router = Router();

// Tabla completa (si quieres, protégelo con un middleware de admin)
router.get('/', listarCodigos);

// Más reciente (global)
router.get('/ultimo', ultimoCodigo);

// Mis códigos (necesita JWT / sesión)
router.get('/mios', requireAuth, misCodigosPorUsuario);

export default router;

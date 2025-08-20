// src/routes/codigos.routes.js
import { Router } from 'express';
import { ultimoCodigo, listarCodigos, misCodigosPorUsuario } from '../controllers/codigos.controller.js';

const router = Router();

// Tabla completa (si quieres, protégelo con un middleware de admin)
router.get('/', listarCodigos);

// Más reciente (global)
router.get('/ultimo', ultimoCodigo);

router.get('/mios', misCodigosPorUsuario);

export default router;

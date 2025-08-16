import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import {
  agregarClase,      // POST /clase
  reemplazarClases,  // PUT  /
  verPorDia          // GET  /:producto_id/:dia
} from '../controllers/horario.controller.js';

const router = Router();

// GET /api/horario/:producto_id/:dia
router.get('/:producto_id/:dia', authGuard, verPorDia);

// POST /api/horario/clase
router.post('/clase', authGuard, agregarClase);

// PUT /api/horario
router.put('/', authGuard, reemplazarClases);

export default router;

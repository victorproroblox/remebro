import { Router } from 'express';
import {
  agregarClase,      // POST /clase
  reemplazarClases,  // PUT  /
  verPorDia          // GET  /:producto_id/:dia
} from '../controllers/horario.controller.js';

const router = Router();

// GET /api/horario/:producto_id/:dia
router.get('/:producto_id/:dia', verPorDia);

// POST /api/horario/clase
router.post('/clase', agregarClase);

// PUT /api/horario
router.put('/', reemplazarClases);

export default router;

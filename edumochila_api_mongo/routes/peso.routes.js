import { Router } from 'express';
import { store, latest, pesosDelDia, pesosPorFecha } from '../controllers/peso.controller.js';

const router = Router();

// Ingesta (IoT) – déjalo abierto o protégelo con API key si quieres
router.post('/', store);

// Lecturas para la app (protegidas con JWT)
router.get('/:producto_id/latest', latest);
router.get('/:producto_id/hoy', pesosDelDia);
router.get('/:producto_id', pesosPorFecha); // ?fecha=YYYY-MM-DD

export default router;

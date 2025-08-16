import { Router } from 'express';
import { store, latest, pesosDelDia, pesosPorFecha } from '../controllers/peso.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = Router();

// Ingesta (IoT) – déjalo abierto o protégelo con API key si quieres
router.post('/', store);

// Lecturas para la app (protegidas con JWT)
router.get('/:producto_id/latest', authGuard, latest);
router.get('/:producto_id/hoy',    authGuard, pesosDelDia);
router.get('/:producto_id',        authGuard, pesosPorFecha); // ?fecha=YYYY-MM-DD

export default router;

import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { ultima, recorridoDelDia, recorridoPorFecha, store } from '../controllers/ubicacion.controller.js';

const router = Router();

// Lecturas para la app (protégele con JWT)
router.get('/:producto_id/ultima',     authGuard, ultima);
router.get('/:producto_id/hoy',        authGuard, recorridoDelDia);
router.get('/:producto_id/por-fecha',  authGuard, recorridoPorFecha);

// Ingesta desde IoT (déjalo abierto o protégelo con API key)
router.post("/ingest", ingestGuard, Ubic.create);

export default router;

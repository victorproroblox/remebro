import { Router } from 'express';
import { ultima, recorridoDelDia, recorridoPorFecha, store } from '../controllers/ubicacion.controller.js';

const router = Router();

// Lecturas para la app (protégele con JWT)
router.get('/:producto_id/ultima', ultima);
router.get('/:producto_id/hoy', recorridoDelDia);
router.get('/:producto_id/por-fecha', recorridoPorFecha);

// Ingesta desde IoT (déjalo abierto o protégelo con API key)
router.post('/', store);

export default router;

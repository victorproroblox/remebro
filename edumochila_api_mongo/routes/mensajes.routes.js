import { Router } from 'express';
import { mensajesPorProductoYFecha, create } from '../controllers/message.controller.js';

const router = Router();

router.get('/:producto_id/:fecha', mensajesPorProductoYFecha); // YYYY-MM-DD
router.post('/', create);

export default router;

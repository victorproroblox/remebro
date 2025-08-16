import { Router } from 'express';
import { mensajesPorProductoYFecha, create } from '../controllers/message.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = Router();

router.get('/:producto_id/:fecha', authGuard, mensajesPorProductoYFecha); // YYYY-MM-DD
router.post('/', create);

export default router;

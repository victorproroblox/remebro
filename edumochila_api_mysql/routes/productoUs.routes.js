import { Router } from 'express';
import { registerProduct, getProduct } from '../controllers/productoUs.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = Router();

router.post('/register', authGuard, registerProduct); // Registrar producto al usuario
router.get('/my', authGuard, getProduct);             // Obtener producto del usuario


export default router;

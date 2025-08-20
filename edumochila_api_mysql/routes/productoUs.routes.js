import { Router } from 'express';
import { registerProduct, getProduct } from '../controllers/productoUs.controller.js';

const router = Router();

router.post('/register', registerProduct); // Registrar producto al usuario
router.get('/my', getProduct);             // Obtener producto del usuario


export default router;

import { Router } from 'express';
import { registerProduct, getProduct } from '../controllers/product.controller.js';

const router = Router();

router.post('/register', registerProduct); // POST /api/productos/register
router.get('/my', getProduct);      // GET  /api/productos/my

export default router;

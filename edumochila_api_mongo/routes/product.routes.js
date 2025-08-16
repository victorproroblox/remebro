import { Router } from 'express';
import { registerProduct, getProduct } from '../controllers/product.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = Router();

router.post('/register', authGuard, registerProduct); // POST /api/productos/register
router.get('/my',       authGuard, getProduct);      // GET  /api/productos/my

export default router;

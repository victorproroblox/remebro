import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { index, show, store, registrarPagoPaypal } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/', authGuard, index);               // Listar ventas del usuario
router.get('/:id_ve', authGuard, show);          // Ver detalle de una venta
router.post('/', authGuard, store);              // Crear venta simple (pruebas)
router.post('/paypal', authGuard, registrarPagoPaypal); // Registrar pago PayPal

export default router;

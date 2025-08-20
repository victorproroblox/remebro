import { Router } from 'express';
import { index, show, store, registrarPagoPaypal } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/', index);               // Listar ventas del usuario
router.get('/:id_ve', show);          // Ver detalle de una venta
router.post('/', store);              // Crear venta simple (pruebas)
router.post('/paypal', registrarPagoPaypal); // Registrar pago PayPal

export default router;

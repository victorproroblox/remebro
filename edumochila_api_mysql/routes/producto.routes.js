import { Router } from 'express';
import {
  verProductosAd,
  verProductos,
  filtro,
  agregar,
  actualizar,
  verProducto,
  bajaLogica,
  activarProducto
} from '../controllers/producto.controller.js';
// import { authGuard } from '../middlewares/authGuard.js'; // si quieres proteger admin

const router = Router();

// Público (cliente)
router.get('/', verProductos);                 // /api/productos
router.get('/filtro', filtro);                 // /api/productos/filtro?id_categoria=#

// Admin (si quieres, protege con authGuard)
router.get('/admin', /*authGuard,*/ verProductosAd);
router.post('/', /*authGuard,*/ agregar);
router.put('/:id', /*authGuard,*/ actualizar);
router.get('/:id', /*authGuard,*/ verProducto);
router.patch('/:id/baja', /*authGuard,*/ bajaLogica);
router.patch('/:id/activar', /*authGuard,*/ activarProducto);

export default router;

import { Router } from 'express';
import { verCategorias } from '../controllers/categoria.controller.js';

const router = Router();

// GET /api/categorias
router.get('/', verCategorias);

export default router;

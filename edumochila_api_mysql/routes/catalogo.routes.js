import { Router } from 'express';
import { catalogo } from '../controllers/catalogo.controller.js';

const router = Router();

// GET /api/catalogo
router.get('/', catalogo);

export default router;

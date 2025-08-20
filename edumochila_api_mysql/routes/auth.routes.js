// routes/auth.routes.js
import { Router } from 'express';
import { login, register, logout, dbCheck } from '../controllers/auth.controller.js';

const router = Router();

// /api/auth/...
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Verificar conexión a la base de datos
router.get('/db-check', dbCheck);

export default router;

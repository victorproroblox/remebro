import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = Router();

// /api/auth/...
router.post('/login', auth.login);
router.post('/register', auth.register);

// Opcional: cerrar sesión “lógico” (blacklist simple en cliente)
router.post('/logout', authGuard, auth.logout);

// Probar conexión DB estilo verificarConexion()
router.get('/db-check', auth.dbCheck);

export default router;

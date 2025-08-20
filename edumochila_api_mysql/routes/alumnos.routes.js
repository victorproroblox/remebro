// routes/alumnos.routes.js
import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { crearAlumno, listarAlumnos, eliminarAlumno } from '../controllers/alumnos.controller.js';

const router = Router();

router.get('/alumnos', authGuard, listarAlumnos);
router.post('/alumnos', authGuard, crearAlumno);
router.delete('/alumnos/:producto_id', authGuard, eliminarAlumno);

export default router;

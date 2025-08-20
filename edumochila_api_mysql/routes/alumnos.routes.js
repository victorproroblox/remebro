// routes/alumnos.routes.js
import { Router } from 'express';
import { crearAlumno, listarAlumnos, eliminarAlumno } from '../controllers/alumnos.controller.js';

const router = Router();

router.get('/alumnos', listarAlumnos);
router.post('/alumnos', crearAlumno);
router.delete('/alumnos/:producto_id', eliminarAlumno);

export default router;

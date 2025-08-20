// src/routes/estados.routes.js
import { Router } from "express";
import { index } from "../controllers/estados.controller.js";

const router = Router();

// Catálogo de estados
router.get("/", index);

export default router;

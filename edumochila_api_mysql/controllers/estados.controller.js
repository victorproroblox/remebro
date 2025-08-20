// src/controllers/estados.controller.js
import Estado from "../models/Estado.js";

/**
 * GET /api/estados
 * Devuelve el catálogo completo de estados (orden alfabético)
 */
export async function index(req, res) {
  try {
    const estados = await Estado.findAll({
      attributes: ["id_estado", "nom_estado"],
      order: [["nom_estado", "ASC"]],
    });

    // opcional: cache corto en CDN / browser
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.json(estados);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error en el servidor: " + e.message });
  }
}

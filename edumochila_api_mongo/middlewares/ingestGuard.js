// middlewares/ingestGuard.js
export function ingestGuard(req, res, next) {
  try {
    const expected = process.env.INGEST_API_KEY || "";
    if (!expected) {
      return res.status(500).json({ message: "Ingest key no configurada" });
    }

    // Acepta por header o query param (útil para pruebas rápidas)
    const key = req.get("x-api-key") || req.query.key;

    if (!key || key !== expected) {
      return res.status(401).json({ message: "Ingest key inválida o ausente" });
    }

    // (Opcional) marcar el request como procedente de un dispositivo
    req.user = { sub: "device", role: "ingest" };
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Error en ingest guard" });
  }
}

import { Router } from 'express';
const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'edumochila_api_mysql' });
});

export default router;

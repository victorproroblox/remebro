import axios from 'axios';
import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

/**
 * GET /api/ventas
 * Ventas del usuario autenticado
 */
export async function index(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No autenticado' });

    const ventas = await Venta.findAll({
      where: { id_us },
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id_pr', 'nom_pr', 'precio_pr', 'img_pr'],
        },
      ],
      order: [['fec_ve', 'DESC']],
    });

    return res.status(200).json(ventas);
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/ventas/:id_ve
 * Detalle de una venta (solo si pertenece al usuario)
 */
export async function show(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No autenticado' });

    const { id_ve } = req.params;

    const venta = await Venta.findOne({
      where: { id_ve, id_us },
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id_pr', 'nom_pr', 'precio_pr', 'img_pr'],
        },
      ],
    });

    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });

    return res.status(200).json(venta);
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * POST /api/ventas
 * Crear venta simple (sin PayPal)
 * Body: { id_pr: 4, total_ve: 450.00 }
 */
export async function store(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No autenticado' });

    const { id_pr, total_ve } = req.body;

    if (!id_pr || !Number.isInteger(Number(id_pr))) {
      return res.status(422).json({ message: 'id_pr requerido y entero' });
    }
    if (total_ve === undefined || Number(total_ve) < 0) {
      return res.status(422).json({ message: 'total_ve requerido y >= 0' });
    }

    const prod = await Producto.findByPk(id_pr, {
      attributes: ['id_pr', 'precio_pr'],
    });
    if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });

    const venta = await Venta.create({
      id_us,
      id_pr: prod.id_pr,
      fec_ve: new Date(),        // 👈 asegura no nulo aunque la DB no tenga DEFAULT
      total_ve: Number(total_ve),
      paypal_order_id: null,     // en flujo sin PayPal queda null
    });

    return res.status(201).json({ message: 'Venta creada', venta });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * POST /api/ventas/paypal
 * Validación y registro de una compra realizada con PayPal (ya capturada en frontend).
 * Body: { order_id: 'PAYPAL_ORDER_ID', id_pr: 4, total: 450.00 }
 */
// controllers/ventas.controller.js
export async function registrarPagoPaypal(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No autenticado' });

    const { order_id, id_pr, total } = req.body;
    if (!order_id || typeof order_id !== 'string') {
      return res.status(422).json({ message: 'order_id es requerido' });
    }
    if (!id_pr || !Number.isInteger(Number(id_pr))) {
      return res.status(422).json({ message: 'id_pr requerido y entero' });
    }
    if (total === undefined || Number(total) < 0) {
      return res.status(422).json({ message: 'total requerido y >= 0' });
    }

    // 0) Valida producto (opcional pero útil para feedback claro)
    const prod = await Producto.findByPk(id_pr, { attributes: ['id_pr', 'precio_pr', 'status_pr'] });
    if (!prod || prod.status_pr !== 1) {
      return res.status(404).json({ message: 'Producto inexistente o inactivo' });
    }

    // 1) PayPal token
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret   = process.env.PAYPAL_SECRET;
    const baseUrl  = (process.env.PAYPAL_MODE || 'sandbox') === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const tokenResp = await axios.post(
      `${baseUrl}/v1/oauth2/token`,
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        auth: { username: clientId, password: secret },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) return res.status(502).json({ message: 'No se pudo autenticar con PayPal' });

    // 2) Consulta orden
    const orderResp = await axios.get(`${baseUrl}/v2/checkout/orders/${order_id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const status   = orderResp.data?.status;
    const amount   = orderResp.data?.purchase_units?.[0]?.amount?.value;
    const currency = orderResp.data?.purchase_units?.[0]?.amount?.currency_code;

    if (status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Pago no completado' });
    }

    // 3) Montos iguales (2 decimales)
    const normalize2 = (n) => Number(n).toFixed(2);
    if (normalize2(amount) !== normalize2(total)) {
      return res.status(400).json({ message: 'Monto no coincide' });
    }

    // 4) Registrar vía SP
    // Opción A: con multipleStatements (más simple)
    const sql = `
      SET @out_id_ve := 0;
      CALL checkout_paypal(:p_id_us, :p_id_pr, :p_total, :p_order_id, @out_id_ve);
      SELECT @out_id_ve AS out_id_ve;
    `;

    const [rows] = await sequelize.query(sql, {
      replacements: {
        p_id_us: id_us,
        p_id_pr: Number(id_pr),
        p_total: Number(total),
        p_order_id: order_id,
      },
      // type: QueryTypes.SELECT  // opcional; Sequelize retorna el último SELECT como rows en mysql2
    });

    // Dependiendo de versión/driver, rows puede ser:
    // - array de resultsets o
    // - directamente el último resultset.
    let outIdVe;
    if (Array.isArray(rows)) {
      const last = rows[rows.length - 1];
      outIdVe = Array.isArray(last) ? last[0]?.out_id_ve : rows[0]?.out_id_ve;
    } else {
      outIdVe = rows?.out_id_ve;
    }

    // Si quieres devolver la venta completa:
    let venta = null;
    if (outIdVe) {
      venta = await Venta.findByPk(outIdVe);
    } else {
      // Si por alguna razón no vino el OUT, intenta localizar por order_id (idempotencia)
      venta = await Venta.findOne({ where: { paypal_order_id: order_id } });
    }

    return res.status(201).json({
      message: 'Venta registrada',
      venta,
      paypal: { order_id, status, amount, currency },
    });
  } catch (e) {
    // Duplicado (si tienes UNIQUE en paypal_order_id)
    if (e?.original?.code === 'ER_DUP_ENTRY' || e?.original?.errno === 1062) {
      const { order_id } = req.body || {};
      const venta = await Venta.findOne({ where: { paypal_order_id: order_id } });
      return res.status(200).json({
        message: 'Orden ya registrada (idempotente)',
        venta,
      });
    }
    // Error PayPal
    if (axios.isAxiosError(e)) {
      const code = e.response?.status || 500;
      const msg = e.response?.data || e.message;
      return res.status(code).json({ message: 'Error PayPal', detail: msg });
    }
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

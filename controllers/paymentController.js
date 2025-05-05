// controllers/payment.controller.js
//
// ▸ paymentIntent .......... Stripe (tarjetas)
// ▸ create_preference ...... Mercado Pago + creación de Order
// ▸ mpWebhook .............. Webhook que actualiza el estado de la Order
//

import Stripe from 'stripe';
import {
  Preference,
  Payment,
  MercadoPagoConfig,
} from 'mercadopago';

import sequelize from '../database.js';
import Order from '../models/order.model.js';
import { getIo } from '../socket.js';     // ajusta la ruta a donde exportes tu instancia

/* ──────────────────────────────── Config ─────────────────────────────── */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const mercadoClient = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

/* ───────────── Generador de código numérico de 6 dígitos ─────────────── */
async function generateOrderCode() {
  let code, exists = true;
  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000).toString(); // 100 000‑999 999
    exists = await Order.findOne({ where: { code } });
  }
  return code;
}

/* ─────────────────────────── Stripe: PaymentIntent ───────────────────── */
export const paymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    return res.status(500).json({ error: 'Payment processing failed.' });
  }
};

/* ───────────────────── Mercado Pago: Preferencia + Order ─────────────── */
export const create_preference = async (req, res) => {
  const { order: orderData, items } = req.body;
  console.log('orderData', orderData);

  if (!orderData || !items?.length)
    return res.status(400).json({ error: 'Missing order or items' });

  const t = await sequelize.transaction();
  try {
    /* 1️⃣  Código */
    const code = await generateOrderCode();

    /* 2️⃣  Crear Order */
    const newOrder = await Order.create(
      {
        code,                                 // ← 6 dígitos
        deliveryAddress: orderData.deliveryAddress,
        partner_id:      orderData.partner_id ?? null,
        user_id:         orderData.user_id    ?? null,
        finalPrice:      orderData.finalPrice,
        deliveryFee:     orderData.deliveryFee,
        price:           orderData.price,
        status:          'pendiente',
      },
      { transaction: t },
    );

    /* 3️⃣  Preferencia */
    const prefBody = {
      items: items.map(i => ({
        title:       i.name,
        quantity:    i.quantity,
        unit_price:  i.price,
        currency_id: i.currency_id || 'ARS',
      })),

      back_urls: {
        success: 'premierburguer://payment-success',
        failure: 'premierburguer://payment-failure',
        pending: 'premierburguer://payment-pending',
      },
      notification_url:'https://2a98-200-126-230-108.ngrok-free.app/api/payment/mp/webhook',
      auto_return: 'approved',
      metadata:   { order_id: newOrder.id, code },
    };

    const preference = new Preference(mercadoClient);
    const prefRes   = await preference.create({ body: prefBody });

    await t.commit();

    return res.json({
      order: {
        id:          newOrder.id,
        code,
        status:      newOrder.status,
        finalPrice:  newOrder.finalPrice,
        deliveryFee: newOrder.deliveryFee,
        price:       newOrder.price,
      },
      preference: {
        id:         prefRes.id,
        init_point: prefRes.init_point,  // usa sandbox_init_point en test
      },
    });
  } catch (error) {
    await t.rollback();
    console.error('MP create_preference Error:', error);
    return res.status(500).json({ error: 'No se pudo crear la preferencia.' });
  }
};

/* ──────────────────────── Webhook Mercado Pago ───────────────────────── */
/* ──────────────────────── Webhook Mercado Pago ────────────────────── */
export const mpWebhook = async (req, res) => {
  res.sendStatus(200);                     // respuesta rápida

  try {
    /* 1. paymentId */
    let paymentId;
    if (req.body?.type === 'payment')                paymentId = req.body.data?.id;
    if (req.query.topic === 'payment' && req.query.id) paymentId = req.query.id;
    if (!paymentId) return;

    /* 2. Traer pago */
    const paymentClient = new Payment(mercadoClient);
    const { status, metadata } = await paymentClient.get({ id: paymentId });
    if (!metadata?.order_id) return;

    /* 3. Nuevo estado */
    let newStatus = 'pendiente';
    if (status === 'approved')                      newStatus = 'aceptada';
    if (status === 'rejected' || status === 'cancelled') newStatus = 'rechazada';

    /* 4. Actualizar Order */
    await Order.update(
      { status: newStatus },
      { where: { id: metadata.order_id } },
    );

    /* 5. Buscar usuario (raw) y emitir socket */
    const order = await Order.findByPk(metadata.order_id, {
      attributes: ['user_id'],
      raw: true,                         // ← objeto plano: { user_id: 1 }
    });

    if (order?.user_id) {
      console.log(`Emitiendo WS para user ${order.user_id}`);
      const io = getIo()
      io.to(String(order.user_id)).emit('order_state_changed', {
        orderId: metadata.order_id,
        status:  newStatus,
      });
    } else {
      console.warn(`Order ${metadata.order_id} sin user_id — no WS`);
    }
  } catch (err) {
    console.error('MP Webhook Error:', err);
  }
};

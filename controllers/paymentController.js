// controllers/paymentController.js
import Stripe from 'stripe';
import { Preference, MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';

import sequelize from '../database.js';
import Order from '../models/order.model.js';
import OrderProducts from '../models/orderProducts.model.js';
import { unifyItems } from './orderController.js';

dotenv.config();

/*───────────────────────────────*
 * SDK CONFIG
 *───────────────────────────────*/
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN, // TEST-xxxxxxxxxxxxxxxx
});

/*───────────────────────────────*
 * 1) STRIPE (sin cambios)
 *───────────────────────────────*/
export const paymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.floor(amount),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    return res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error('Stripe error:', e);
    return res.status(500).json({ error: 'Stripe error' });
  }
};

/*───────────────────────────────*
 * 2) MERCADO PAGO – orden + preferencia
 *───────────────────────────────*/
export const initMercadoPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { order: orderDTO, items } = req.body;
    if (!items?.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Items missing' });
    }

    /* 2.1  Orden pendiente */
    const newOrder = await Order.create(
      { ...orderDTO, status: 'pendiente' },
      { transaction: t }
    );

    /* 2.2  Productos */
    const rows = unifyItems(items).map((p) => ({
      order_id: newOrder.id,
      product_id: p.productId,
      quantity: p.quantity,
      price: p.totalPrice,
      extras: {
        includedIngredients: p.includedIngredients,
        extraIngredients: p.extraIngredients,
      },
      removedIngredients: p.removedIngredients ?? null,
    }));
    await OrderProducts.bulkCreate(rows, { transaction: t });
    await t.commit();

    /* 2.3  Preferencia */
    const preference = new Preference(mpClient);
    const prefBody = {
      items: [
        {
          title: 'Premier Burguer Order',
          quantity: 1,
          unit_price: +orderDTO.finalPrice,
          currency_id: 'ARS',
        },
      ],
      back_urls: getMpBackUrls(),
      external_reference: `${newOrder.id}`,
      ...(process.env.NODE_ENV === 'production' && {
        notification_url: `${process.env.API_URL}/payment/webhooks/mercadopago`,
        auto_return: 'approved',
        payer: {
          email: "ramiro.alet@gmail.com", // <- debes enviarlo desde el frontend
        },
      }),
    };

    const prefRes = await preference.create({ body: prefBody });

    return res.status(201).json({
      orderId: newOrder.id,
      preferenceId: prefRes.id,
      init_point:prefRes.init_point,
    });
  } catch (e) {
    await t.rollback();
    console.error('MP init error:', e);
    return res.status(500).json({ error: 'MP init error' });
  }
};

/*───────────────────────────────*
 * 3) WEBHOOK – producción
 *───────────────────────────────*/
export const mpWebhook = async (req, res) => {
  try {
    const { id, topic } = req.body;
    if (topic !== 'payment') return res.sendStatus(204);

    const payment = await mpClient.get(`/v1/payments/${id}`);
    const orderId = payment.external_reference;

    const statusMap = {
      approved: 'aceptada',
      rejected: 'rechazada',
      cancelled: 'cancelada',
      in_process: 'pendiente',
      pending: 'pendiente',
    };

    await Order.update(
      { status: statusMap[payment.status] ?? 'pendiente' },
      { where: { id: orderId } }
    );
    return res.sendStatus(200);
  } catch (e) {
    console.error('MP webhook error:', e);
    return res.sendStatus(500);
  }
};

/*───────────────────────────────*
 * helper para back_urls
 *───────────────────────────────*/
function getMpBackUrls() {
  return process.env.NODE_ENV === 'development'
    ? {
        success: 'premierburguer://payment-success',
        failure: 'premierburguer://payment-failure',
        pending: 'premierburguer://payment-pending',
      }
    : {
        success: 'https://premierburguer.app/payments/mp/success',
        failure: 'https://premierburguer.app/payments/mp/failure',
        pending: 'https://premierburguer.app/payments/mp/pending',
      };
}

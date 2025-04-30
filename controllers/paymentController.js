// payment.controller.js

import Stripe from 'stripe';
import { Preference, MercadoPagoConfig } from 'mercadopago';

const mercado_client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN, // Coloca tu Access Token de Mercado Pago
});

// Clave secreta de prueba de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * paymentIntent (Stripe)
 * 1. Recibe el monto en el body.
 * 2. Crea un Payment Intent en Stripe.
 * 3. Devuelve el clientSecret al frontend.
 */
export const paymentIntent = async (req, res) => {
  const { amount } = req.body;
  console.log('Stripe paymentIntent body:', req.body);

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  try {
    // Stripe exige enteros => multiplica por 100 (centavos) desde el front si lo requieres
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    return res.status(500).json({ error: 'Payment processing failed. Please try again.' });
  }
};

/**
 * create_preference (Mercado Pago)
 * 1. Recibe un array de items en el body (name, quantity, price, currency_id, etc.).
 * 2. Crea una preferencia en MP.
 * 3. Devuelve el `init_point` (o `sandbox_init_point`) y el ID de la preferencia.
 */
export const create_preference = async (req, res) => {
  console.log('Mercado Pago create_preference body:', req.body);
  try {
    // Ojo: se recomienda usar "back_urls" en plural
    const body = {
      items: req.body.map((item) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      })),
      back_urls: {
        success: "premierburguer://payment-success",
        failure: "premierburguer://payment-failure",
        pending: "premierburguer://payment-pending",
      },
      // auto_return: 'approved', // Quitar o poner, pero si lo usas necesita URL HTTPS válida en "success".
    };

    const preference = new Preference(mercado_client);
    const result = await preference.create({ body });

    // Mercado Pago retorna varias propiedades: init_point, sandbox_init_point...
    // Si estás en modo Sandbox, usa sandbox_init_point
    return res.json({
      id: result.id,
      init_point: result.init_point, // o result.sandbox_init_point si estás en sandbox
    });
  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return res.status(500).json({ error: 'Error al crear la preferencia' });
  }
};

// routes/payment.js
import express from 'express';
import {
  paymentIntent,
  create_preference,
  mpWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/intent', paymentIntent);
router.post('/mp/create-preference', create_preference);

// Mercado Pago envía GET (verificación) y POST (notificaciones)
router.route('/mp/webhook').get(mpWebhook).post(mpWebhook);

export default router;

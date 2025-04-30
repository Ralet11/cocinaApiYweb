// routes/paymentRoutes.js
import express from 'express';
import {
  paymentIntent,      // Stripe
  initMercadoPago,    // ← NUEVO: crea orden + preferencia
  mpWebhook           // ← NUEVO: recibe notificaciones
} from '../controllers/paymentController.js';

const router = express.Router();

/*────────── STRIPE ──────────*/
router.post('/intent', paymentIntent);

/*──────── MERCADO PAGO ───────*/
router.post('/mp/init', initMercadoPago);          // 1) orden + preferencia
router.post('/webhooks/mercadopago', mpWebhook);   // 2) confirmación (sin token)

export default router;

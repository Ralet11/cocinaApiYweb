
import express from 'express';
import { create_preference, paymentIntent } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/intent', paymentIntent);
router.post('/mp/init', create_preference)


export default router;

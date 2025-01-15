
import express from 'express';
import { paymentIntent } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/intent', paymentIntent);



export default router;

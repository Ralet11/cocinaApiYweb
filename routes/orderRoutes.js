import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersByPartner,
  getAllOrdersByUser
} from '../controllers/orderController.js';
import { validateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/partner/orders', validateToken, getAllOrdersByPartner);
router.get('/getAllByUser/:userId', getAllOrdersByUser);

export default router;
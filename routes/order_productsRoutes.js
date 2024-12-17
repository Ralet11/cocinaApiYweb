
import express from 'express';
import {
  getAllOrderProductses,
  getOrderProductsById,
  createOrderProducts,
  updateOrderProducts,
  deleteOrderProducts
} from '../controllers/order_productsController.js';

const router = express.Router();

router.get('/', getAllOrderProductses);
router.get('/:id', getOrderProductsById);
router.post('/', createOrderProducts);
router.put('/:id', updateOrderProducts);
router.delete('/:id', deleteOrderProducts);

export default router;

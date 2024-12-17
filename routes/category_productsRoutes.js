
import express from 'express';
import {
  getAllCategoryProductses,
  getCategoryProductsById,
  createCategoryProducts,
  updateCategoryProducts,
  deleteCategoryProducts
} from '../controllers/category_productsController.js';

const router = express.Router();

router.get('/', getAllCategoryProductses);
router.get('/:id', getCategoryProductsById);
router.post('/', createCategoryProducts);
router.put('/:id', updateCategoryProducts);
router.delete('/:id', deleteCategoryProducts);

export default router;

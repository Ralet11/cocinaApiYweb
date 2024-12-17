
import express from 'express';
import {
  getAllPartnerProductses,
  getPartnerProductsById,
  createPartnerProducts,
  updatePartnerProducts,
  deletePartnerProducts
} from '../controllers/partner_productsController.js';

const router = express.Router();

router.get('/', getAllPartnerProductses);
router.get('/:id', getPartnerProductsById);
router.post('/', createPartnerProducts);
router.put('/:id', updatePartnerProducts);
router.delete('/:id', deletePartnerProducts);

export default router;

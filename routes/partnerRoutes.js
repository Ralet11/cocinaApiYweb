
import express from 'express';
import {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController.js';

const router = express.Router();

//crear una ruta para el partner mas cercano qe coincida con la ruta del front

router.get('/', getAllPartners);
router.get('/:id', getPartnerById);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

export default router;

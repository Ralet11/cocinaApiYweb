import express from 'express';
import {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getClosestPartner, // Importamos el nuevo controlador
  getPartnerProducts, // Importamos el controlador para los productos
} from '../controllers/partnerController.js';

const router = express.Router();

router.get('/', getAllPartners);

router.get('/:id', getPartnerById);

router.post('/', createPartner);

router.put('/:id', updatePartner);

router.delete('/:id', deletePartner);

// Nueva ruta: Obtener el partner más cercano basado en latitud, longitud y dirección
router.post('/closest', getClosestPartner);

// Nueva ruta: Obtener los productos de un partner por su ID
router.get('/:id/products', getPartnerProducts);

export default router;

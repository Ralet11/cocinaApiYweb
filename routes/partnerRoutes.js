import express from 'express';
import {
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getClosestPartner, 
  getPartnerProducts, 
  loginPartner,
  registerPartner,
  requestPartner //nueva ruta para enviar solicitud de revision al admin(email)
} from '../controllers/partnerController.js';
import { validateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', loginPartner);
router.post('/register', registerPartner);
router.post("/request", requestPartner);

// Rutas protegidas con validateToken
router.get('/', validateToken, getAllPartners);
router.get('/:id', validateToken, getPartnerById);
router.put('/:id', validateToken, updatePartner);
router.delete('/:id', validateToken, deletePartner);

// Nueva ruta: Obtener el partner más cercano basado en latitud, longitud y dirección
router.post('/closest', validateToken, getClosestPartner);

// Nueva ruta: Obtener los productos de un partner por su ID
router.get('/:id/products', validateToken, getPartnerProducts);

export default router;

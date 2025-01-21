import express from 'express';
import {
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getClosestPartner, // Importamos el nuevo controlador
  getPartnerProducts, // Importamos el controlador para los productos
  loginPartner,
  registerPartner
} from '../controllers/partnerController.js';
import { validateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', loginPartner);
router.post('/register', registerPartner);

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

import express from 'express';
import {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getClosestPartner, // Importamos el nuevo controlador
  getPartnerProducts, // Importamos el controlador para los productos
  loginPartner,
  registerPartner
} from '../controllers/partnerController.js';
import { validateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware de autenticación, excluyendo las rutas de login y register
router.use((req, res, next) => {
  // Excluir rutas específicas
  if (req.path === '/login' || req.path === '/register') {
    return next(); // No aplicar el middleware aquí
  }
  validateToken(req, res, next); // Aplicar middleware a todas las demás rutas
});

// Rutas públicas
router.post('/login',loginPartner);
router.post('/register',registerPartner );

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
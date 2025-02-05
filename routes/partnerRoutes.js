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
  requestPartner,
  updatePartnerIngredient,
  getPartnerIngredients,
  getPartnerProductsApp,
  requestPasswordReset,
  resetPassword
} from '../controllers/partnerController.js';

import { validateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// 🔓 RUTAS PÚBLICAS (No requieren autenticación)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', loginPartner);
router.post('/register', registerPartner);
router.post('/request', requestPartner);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// ─────────────────────────────────────────────────────────────────────────────
// 🔐 RUTAS PRIVADAS (Requieren autenticación con validateToken)
// ─────────────────────────────────────────────────────────────────────────────

// 📌 Productos del partner
router.get('/products', validateToken, getPartnerProducts);
router.get('/:id/products', validateToken, getPartnerProductsApp);

// 📌 Ingredientes del partner
router.put('/updateIngredient', validateToken, updatePartnerIngredient);
router.get('/partnerIngredient', validateToken, getPartnerIngredients)
// 📌 Información y gestión de partners
router.get('/', validateToken, getAllPartners);
router.get('/:id', validateToken, getPartnerById);
router.put('/update', validateToken, updatePartner);
router.delete('/:id', validateToken, deletePartner);





// 📌 Partner más cercano
router.post('/closest', validateToken, getClosestPartner);

export default router;

import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
  getAddressesByUser,
  createAddress,
  deleteAddress,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';
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
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Rutas protegidas
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/getAllAddress/:userId', getAddressesByUser);
router.post('/addAddress', createAddress);
router.get('/getAddress/addressId', getAddressesByUser);
router.delete('/deleteAddress/:id', deleteAddress);

export default router;

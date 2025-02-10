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

// Rutas públicas (NO requieren token)
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Rutas protegidas (SÍ requieren token)
router.get('/', validateToken, getAllUsers);
router.get('/:id', validateToken, getUserById);
router.post('/', validateToken, createUser);
router.put('/:id', validateToken, updateUser);
router.delete('/:id', validateToken, deleteUser);
router.get('/getAllAddress/:userId', validateToken, getAddressesByUser);
router.post('/addAddress', validateToken, createAddress);
router.get('/getAddress/addressId', validateToken, getAddressesByUser);
router.delete('/deleteAddress/:id', validateToken, deleteAddress);

export default router;

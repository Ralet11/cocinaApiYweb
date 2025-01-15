
import express from 'express';
import { getByProductId, getAll } from '../controllers/ingredientsController.js';
import { validateToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', getAll);
/* router.post('/', createIngredient); */
/* router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct); */
router.get('/getByProduct/:id', validateToken(), getByProductId)

export default router;

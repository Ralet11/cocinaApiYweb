
import express from 'express';
import {getAllIngredients} from './../controllers/'

const router = express.Router();

router.get('/', getAllIngredients);
/* router.post('/', createIngredient); */
/* router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct); */

export default router;

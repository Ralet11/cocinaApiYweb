import express from "express";
import {
    getAllReview,
    deleteReview,
    getReviewById,
    createReview,
    updateReview,
    getAllReviewPartner,
} from "../controllers/reviewController.js"

const router =express.Router();

router.get('/', getAllReview);
router.get('/getbyid/:id', getReviewById);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview)
router.get('/getbypartner/:id', getAllReviewPartner)
export default router; 
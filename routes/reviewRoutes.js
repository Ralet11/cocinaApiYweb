import express from "express";
import {
    getAllReview,
    deleteReview,
    getReviewById,
    createReview,
    updateReview,
    getAllReviewPartner,
} from "../controllers/reviewController.js"
import { validateToken } from "../middlewares/authMiddleware.js";

const router =express.Router();

router.get('/', getAllReview);
router.get('/getbyid/:id',validateToken, getReviewById);
router.post('/orders/:orderId/review', validateToken, createReview);
router.put('/:id',validateToken, updateReview);
router.delete('/:id', deleteReview)// no se usa
router.get('/partnerReviews/:id',validateToken, getAllReviewPartner)
router.get("/userReviews",validateToken, getAllReview);

export default router; 
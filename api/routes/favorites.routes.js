import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controller/favoriteController.js'; 
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addFavorite);
router.delete('/remove/:propertyId', authMiddleware, removeFavorite);
router.get('/', authMiddleware, getFavorites);

export default router;
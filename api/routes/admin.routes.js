import express from 'express';
import {
    getAllUsers,
    getAllProperties,
    updatePropertyStatus,
    getAllBookings,
    deleteProperty,
} from '../controller/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import isAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, isAdmin);

router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);
router.get('/bookings', getAllBookings);

export default router;

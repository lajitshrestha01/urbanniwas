import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createBooking,getUserBookings, getAgentBookings,updateBookingStatus, cancelBooking } from '../controller/booking.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/user', authMiddleware, getUserBookings);
router.get('/agent', authMiddleware, getAgentBookings);
router.put('/:id', authMiddleware, updateBookingStatus);
router.delete('/:id', authMiddleware, cancelBooking);

export default router; 


import express from 'express';
import { createMessage, getMessages,markMessageAsSeen } from '../controller/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createMessage);
router.get('/', authMiddleware, getMessages);
router.put('/:messageId/seen', authMiddleware, markMessageAsSeen); 


export default router;
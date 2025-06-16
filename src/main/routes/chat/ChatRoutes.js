import express from 'express';
import { ChatController } from '../../controllers/chat/ChatController.js';
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get('/manager', authorizeAdminOrManager, ChatController.getManagerChats);
router.get('/:chatId/messages', ChatController.getMessages);
router.get("/pending-chats",authorizeAdminOrManager,ChatController.getPendingChats)
router.delete('/:chatId/messages', ChatController.clearMessages);
router.get('/me', authenticateJWT, ChatController.getUserChat);

router.put('/:chatId/manager', ChatController.changeManager);

export default router;

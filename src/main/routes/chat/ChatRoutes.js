import express from 'express';
import { ChatController } from '../../controllers/chat/ChatController.js';
import {authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get('/manager', authorizeAdminOrManager, ChatController.getManagerChats);
router.get('/:chatId/messages', ChatController.getMessages);
router.get("/pending-chats",authorizeAdminOrManager,ChatController.getPendingChats)
router.delete('/:chatId/messages', ChatController.clearMessages);
router.get('/user/:userId/messages', ChatController.getUserMessages);

router.put('/:chatId/manager', ChatController.changeManager);

export default router;

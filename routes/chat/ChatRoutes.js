import express from 'express';
import { ChatController } from '../../controllers/chat/ChatController.js';

const router = express.Router();

router.get('/:chatId/messages', ChatController.getMessages);

router.delete('/:chatId/messages', ChatController.clearMessages);

router.put('/:chatId/manager', ChatController.changeManager);

export default router;

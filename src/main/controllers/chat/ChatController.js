import {ChatService} from '../../service/chat/ChatService.js';
import {asyncHandler} from '../../utils/handler/asyncHandler.js';

export const ChatController = {
    getMessages: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        const { beforeId, limit } = req.query;

        const parsedLimit = parseInt(limit) || 50;
        const beforeMessageId = beforeId ? parseInt(beforeId) : null;

        const messages = await ChatService.getMessagesBefore(chatId, beforeMessageId, parsedLimit);

        res.json({
            messages: messages.reverse(), // от старых к новым
            hasMore: messages.length === parsedLimit // если меньше — сообщений больше нет
        });
    }),

    clearMessages: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        await ChatService.clearMessages(chatId);
        res.json({ message: 'Messages cleared successfully' });
    }),

    changeManager: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        const { newManagerId } = req.body;
        const updatedChat = await ChatService.changeManager(chatId, newManagerId);
        res.json(updatedChat);
    })
};

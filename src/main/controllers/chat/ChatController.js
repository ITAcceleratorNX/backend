import { ChatService } from '../../service/chat/ChatService.js';

export const ChatController = {
    async getMessages(req, res) {
        try {
            const { chatId } = req.params;
            const { beforeId, limit } = req.query;

            const parsedLimit = parseInt(limit) || 50;
            const beforeMessageId = beforeId ? parseInt(beforeId) : null;

            const messages = await ChatService.getMessagesBefore(chatId, beforeMessageId, parsedLimit);

            res.json({
                messages: messages.reverse(), // от старых к новым
                hasMore: messages.length === parsedLimit // если меньше — сообщений больше нет
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async clearMessages(req, res) {
        try {
            const { chatId } = req.params;
            await ChatService.clearMessages(chatId);
            res.json({ message: 'Messages cleared successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async changeManager(req, res) {
        try {
            const { chatId } = req.params;
            const { newManagerId } = req.body;
            const updatedChat = await ChatService.changeManager(chatId, newManagerId);
            res.json(updatedChat);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

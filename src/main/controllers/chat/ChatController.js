import {ChatService} from '../../service/chat/ChatService.js';
import {asyncHandler} from '../../utils/handler/asyncHandler.js';
import logger from "../../utils/winston/logger.js";

export const ChatController = {
    getMessages: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        const { beforeId, limit } = req.query;

        const parsedLimit = parseInt(limit) || 50;
        const beforeMessageId = beforeId ? parseInt(beforeId) : null;

        const messages = await ChatService.getMessagesBefore(chatId, beforeMessageId, parsedLimit);

        logger.info('Fetched messages', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            chatId,
            beforeId: beforeId || null,
            limit: parsedLimit,
            returned: messages.length
        });

        res.json({
            messages: messages.reverse(), // от старых к новым
            hasMore: messages.length === parsedLimit // если меньше — сообщений больше нет
        });
    }),

    clearMessages: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        await ChatService.clearMessages(chatId);
        logger.info('Cleared chat messages', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            chatId
        });
        res.json({ message: 'Messages cleared successfully' });
    }),

    changeManager: asyncHandler(async (req, res) => {
        const { chatId } = req.params;
        const { newManagerId } = req.body;
        const updatedChat = await ChatService.changeManager(chatId, newManagerId);
        logger.info('Changed chat manager', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            chatId,
            newManagerId
        });
        res.json(updatedChat);
    }),

    getManagerChats: asyncHandler(async (req, res) => {
        const managerId = req.user.id;
        const chats = await ChatService.getChats({where: {manager_id: managerId}});
        logger.info('Fetched messages', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
        });
        res.json(chats);
    }),
    getPendingChats: asyncHandler(async (req, res) => {
        const chats = await ChatService.getChats({where: {status: "PENDING"}});
        logger.info('Fetched messages', {
            endpoint: req.originalUrl,
            requestId: req.id,
        });
        res.json(chats);
    })
};

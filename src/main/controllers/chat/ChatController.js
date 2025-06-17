import { ChatService } from '../../service/chat/ChatService.js';
import { asyncHandler } from '../../utils/handler/asyncHandler.js';
import logger from "../../utils/winston/logger.js";
import { getById } from '../../service/user/UserService.js'; // путь подкорректируй по проекту

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

    getUserChat: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const user = await getById(userId);

        const chat = await ChatService.getChats({
            where: {
                user_id: userId,
                status: ['PENDING', 'ACCEPTED']
            }
        });

        if (chat && chat.length > 0) {
            logger.info('Fetched user chat', {
                userId,
                userName: user.name,
                endpoint: req.originalUrl,
                requestId: req.id,
                chatId: chat[0].id,
                status: chat[0].status
            });

            res.json({
                ...chat[0].toJSON?.() || chat[0],
                userName: user.name
            });
        } else {
            logger.info('No active chat found for user', {
                userId,
                userName: user.name,
                endpoint: req.originalUrl,
                requestId: req.id,
            });
            res.status(404).json({ message: 'No active chat found', userName: user.name });
        }
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
        const chats = await ChatService.getChats({
            where: { manager_id: managerId },
            include: [{ association: 'user', attributes: ['name'] }]
        });

        logger.info('Fetched manager chats', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
        });

        res.json(
            chats.map(chat => ({
                ...chat.toJSON?.() || chat
            }))
        );
    }),

    getPendingChats: asyncHandler(async (req, res) => {
        const chats = await ChatService.getChats({
            where: { status: "PENDING" },
            include: [{ association: 'user', attributes: ['name'] }]
        });

        logger.info('Fetched pending chats', {
            endpoint: req.originalUrl,
            requestId: req.id,
        });

        res.json(
            chats.map(chat => ({
                ...chat.toJSON?.() || chat
            }))
        );
    })
};

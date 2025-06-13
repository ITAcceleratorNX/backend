import {Chat, Message} from '../../models/init/index.js';

export const ChatService = {
    async getMessagesBefore(chatId, beforeMessageId = null, limit = 50) {
        const where = { chat_id: chatId };
        if (beforeMessageId) {
            where.id = { lt: beforeMessageId };
        }

        const messages = await Message.findAll({
            where,
            order: [['id', 'DESC']],
            limit
        });

        return messages;
    },

    async clearMessages(chatId) {
        return await Message.destroy({ where: { chat_id: chatId } });
    },

    async changeManager(chatId, newManagerId) {
        const chat = await Chat.findByPk(chatId);
        if (!chat) throw new Error('Chat not found');

        chat.manager_id = newManagerId;
        await chat.save();

        return chat;
    },
    async getChats(options = {}) {
        return await Chat.findAll(options);
    }
};

import { ChatService } from '../../../service/chat/ChatService.js';
import { Chat, Message } from '../../../models/init/index.js';

jest.mock('../../../models/init/index.js', () => ({
    Chat: {
        findByPk: jest.fn()
    },
    Message: {
        findAll: jest.fn(),
        destroy: jest.fn()
    }
}));

describe('ChatService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMessagesBefore', () => {
        it('должен вернуть сообщения без beforeMessageId', async () => {
            const mockMessages = [{ id: 1 }, { id: 2 }];
            Message.findAll.mockResolvedValue(mockMessages);

            const result = await ChatService.getMessagesBefore(1);

            expect(Message.findAll).toHaveBeenCalledWith({
                where: { chat_id: 1 },
                order: [['id', 'DESC']],
                limit: 50
            });

            expect(result).toEqual(mockMessages);
        });

        it('должен вернуть сообщения с beforeMessageId', async () => {
            const mockMessages = [{ id: 1 }];
            Message.findAll.mockResolvedValue(mockMessages);

            const result = await ChatService.getMessagesBefore(1, 10);

            expect(Message.findAll).toHaveBeenCalledWith({
                where: { chat_id: 1, id: { lt: 10 } },
                order: [['id', 'DESC']],
                limit: 50
            });

            expect(result).toEqual(mockMessages);
        });
    });

    describe('clearMessages', () => {
        it('должен удалить все сообщения чата', async () => {
            Message.destroy.mockResolvedValue(3);

            const result = await ChatService.clearMessages(1);

            expect(Message.destroy).toHaveBeenCalledWith({ where: { chat_id: 1 } });
            expect(result).toBe(3);
        });
    });

    describe('changeManager', () => {
        it('должен изменить manager_id', async () => {
            const mockChat = {
                manager_id: 1,
                save: jest.fn(),
            };
            Chat.findByPk.mockResolvedValue(mockChat);

            const result = await ChatService.changeManager(1, 5);

            expect(Chat.findByPk).toHaveBeenCalledWith(1);
            expect(mockChat.manager_id).toBe(5);
            expect(mockChat.save).toHaveBeenCalled();
            expect(result).toBe(mockChat);
        });

        it('должен выбросить ошибку, если чат не найден', async () => {
            Chat.findByPk.mockResolvedValue(null);

            await expect(ChatService.changeManager(1, 5))
                .rejects
                .toThrow('Chat not found');
        });
    });

});

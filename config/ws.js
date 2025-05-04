import { WebSocketServer } from 'ws';
import { Chat, User, Message } from '../models/init/index.js';
import cookie from 'cookie';
import jwt from "jsonwebtoken"; // npm install cookie

let wssInstance = null;

export function setWSS(server) {
    wssInstance = new MyWebSocketServer(server);
    return wssInstance;
}

export function getWSS() {
    return wssInstance;
}

class MyWebSocketServer {
    constructor(server) {
        this.ws = new WebSocketServer({ server });
        this.clients = new Map();
        this.setup();
    }


    setup() {
        this.ws.on('connection', (ws, req) => {
            const cookies = req.headers.cookie;

            if (!cookies) {
                ws.close(4001, 'Cookie not provided');
                return;
            }

            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.token;

            if (!token) {
                ws.close(4001, 'JWT token not found in cookies');
                return;
            }

            let userId;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id; // или decoded.userId
            } catch (err) {
                ws.close(4002, 'Invalid JWT token');
                return;
            }

            this.clients.set(String(userId), ws);
            console.log(`Client connected: ${userId}`);

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(data, ws);
                } catch (error) {
                    console.error('Invalid message:', error);
                }
            });

            ws.on('close', () => {
                this.clients.delete(String(userId));
                console.log(`Client disconnected: ${userId}`);
            });
        });
    }


    async handleMessage(data, ws) {
        switch (data.type) {
            case 'START_CHAT':
                await this.startChat(data, ws);
                break;
            case 'SEND_MESSAGE':
                await this.sendMessage(data);
                break;
            case 'ACCEPT_CHAT':
                await this.acceptChat(data, ws);
                break;

        }
    }

    async startChat({ userId }) {
        const chat = await Chat.create({ user_id: userId, status: 'PENDING' });

        // Отправляем пользователю уведомление "Ожидайте"
        const userWs = this.clients.get(String(userId));
        if (userWs) {
            userWs.send(JSON.stringify({
                type: 'WAITING_FOR_MANAGER',
                message: 'Пожалуйста, подождите. Один из свободных менеджеров скоро ответит.'
            }));
        }

        // Уведомляем всех менеджеров
        const managers = await User.findAll({ where: { role: 'ADMIN' } });
        for (const manager of managers) {
            const managerWs = this.clients.get(String(manager.id));
            if (managerWs) {
                managerWs.send(JSON.stringify({
                    type: 'NEW_CHAT',
                    chatId: chat.id,
                    userId
                }));
            }
        }
    }
    async acceptChat({ chatId, managerId }) {
        const chat = await Chat.findByPk(chatId);
        if (!chat || chat.status !== 'PENDING') return;

        await chat.update({
            manager_id: managerId,
            status: 'ACCEPTED'
        });

        // Уведомить пользователя, что чат принят
        const userWs = this.clients.get(String(chat.user_id));
        if (userWs) {
            userWs.send(JSON.stringify({
                type: 'CHAT_ACCEPTED',
                chatId,
                managerId
            }));
        }

        // Уведомить других менеджеров, что чат занят
        // const managers = await User.findAll({ where: { role: 'ADMIN' } });
        // for (const manager of managers) {
        //     if (manager.id !== managerId) {
        //         const otherManagerWs = this.clients.get(String(manager.id));
        //         if (otherManagerWs) {
        //             otherManagerWs.send(JSON.stringify({
        //                 type: 'CHAT_TAKEN',
        //                 chatId,
        //                 byManagerId: managerId
        //             }));
        //         }
        //     }
        // }
    }

    async sendMessage({ chatId, senderId, message, isFromUser }) {
        const chat = await Chat.findByPk(chatId);
        if (!chat) return;

        const newMessage = await Message.create({
            chat_id: chatId,
            sender_id: senderId,
            text: message,
            is_from_user: isFromUser
        });

        const receiverId = isFromUser ? chat.manager_id : chat.user_id;
        const receiverWs = this.clients.get(String(receiverId));

        if (receiverWs) {
            receiverWs.send(JSON.stringify({
                type: 'NEW_MESSAGE',
                message: newMessage
            }));
        }
    }
}

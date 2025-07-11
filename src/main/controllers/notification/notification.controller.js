import { NotificationService } from '../../service/notification/notification.service.js';
import { CreateNotificationDto } from '../../dto/notification/notification.dto.js';

const service = new NotificationService();

export class NotificationController {
    async create(req, res) {
        try {
            const parsed = CreateNotificationDto.parse(req.body);
            const notification = await service.sendNotification(parsed);
            res.status(201).json(notification);
        } catch (error) {
            res.status(400).json({ message: 'Невалидные данные', error: error.errors || error.message });
        }
    }
    async sendBulk(req, res) {
        try {
            const {
                user_ids = [],
                isToAll = false,
                title,
                message,
                notification_type,
                is_email = false,
                is_sms = false,
                related_order_id = null
            } = req.body;

            if (!title || !message || !notification_type) {
                return res.status(400).json({ message: 'title, message и notification_type обязательны' });
            }

            await service.sendBulkNotification({
                user_ids,
                isToAll,
                title,
                message,
                notification_type,
                is_email,
                is_sms,
                related_order_id
            });

            res.status(201).json({ message: 'Массовое уведомление отправлено' });
        } catch (error) {
            res.status(400).json({ message: 'Ошибка отправки уведомлений', error: error.message });
        }
    }

    async getAll(req, res) {
        const list = await service.getAllNotifications();
        res.json(list);
    }

    async getById(req, res) {
        const id = req.user.id;
        const notif = await service.getNotificationsByUserId(id);
        if (notif) return res.json(notif);
        res.status(404).json({ message: 'Уведомление не найдено' });
    }

    async markRead(req, res) {
        const id = req.params.id;
        const user_id = req.user.id;
        const updated = await service.markAsRead(user_id,id);
        res.json(updated);
    }

    async delete(req, res) {
        const id = req.user.id;
        await service.deleteNotification(id);
        res.status(204).send();
    }
}

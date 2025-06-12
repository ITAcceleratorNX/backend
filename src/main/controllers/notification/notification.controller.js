import { NotificationService } from '../../service/notification/notification.service.js';
import { CreateNotificationDto } from '../../dto/notification/notification.dto.js';
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

const service = new NotificationService();

export class NotificationController {
    async create(req, res) {
        try {
            const parsed = CreateNotificationDto.parse(req.body);
            const notification = await service.createNotification(parsed);
            res.status(201).json(notification);
        } catch (error) {
            res.status(400).json({ message: 'Невалидные данные', error: error.errors || error.message });
        }
    }

    async getAll(req, res) {
        const list = await service.getAllNotifications();
        res.json(list);
    }

    async getById(req, res) {
        const id = +req.params.id;
        const notif = await service.getNotificationById(id);
        if (notif) return res.json(notif);
        res.status(404).json({ message: 'Уведомление не найдено' });
    }

    async markRead(req, res) {
        const id = +req.params.id;
        const updated = await service.markAsRead(id);
        res.json(updated);
    }

    async delete(req, res) {
        const id = +req.params.id;
        await service.deleteNotification(id);
        res.status(204).send();
    }
}

import Notification from '../../models/notification.js';

export class NotificationService {
    async createNotification(data) {
        const notification = await Notification.create(data);
        return notification;
    }

    async getAllNotifications() {
        return Notification.findAll();
    }

    async getNotificationById(id) {
        return Notification.findByPk(id);
    }

    async markAsRead(id) {
        await Notification.update({ is_read: true }, { where: { notification_id: id } });
        return this.getNotificationById(id);
    }

    async deleteNotification(id) {
        return Notification.destroy({ where: { notification_id: id } });
    }
}


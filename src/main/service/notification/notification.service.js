import Notification from '../../models/Notification.js';
import User from '../../models/User.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import MobizonApi from "../../utils/mobizon/Mobizon.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmail = process.env.SENDGRID_EMAIL;
const mobizon = new MobizonApi(process.env.MOBIZON_API_KEY);

export class NotificationService {
    async sendNotification(notificationData) {
        const {
            user_id,
            title,
            message,
            notification_type,
            related_order_id = null,
            is_email = false,
            is_sms = false,
        } = notificationData;

        await Notification.create({
            user_id,
            title,
            message,
            notification_type,
            related_order_id,
            is_email,
            is_sms,
        });

        const user = await User.findByPk(user_id);
        if (!user) {
            console.log(`❌ Пользователь с id=${user_id} не найден`);
            return;
        }

        const shouldSendEmail = ['payment', 'contract'].includes(notification_type) || is_email;
        const shouldSendSms = ['payment', 'contract'].includes(notification_type) || is_sms;

        if (shouldSendEmail && user.email) {
            await this.sendEmail(user.email, title, message);
        }

        if (shouldSendSms && user.phone) {
            await this.sendSms(user.phone, message);
        }

        console.log(`✅ Уведомление отправлено: user_id=${user_id}, type=${notification_type}`);
    }
    async sendBulkNotification({
                                   user_ids = [],       // массив id пользователей
                                   isToAll = false,     // если true — отправка всем
                                   title,
                                   message,
                                   notification_type,
                                   is_email = false,
                                   is_sms = false,
                                   related_order_id = null
                               }) {
        let users;

        if (isToAll) {
            users = await User.findAll(); // отправить всем
        } else {
            users = await User.findAll({ where: { id: user_ids } }); // только выбранным
        }

        if (!users || users.length === 0) {
            console.warn('❗ Нет пользователей для уведомления');
            return;
        }

        const notifications = users.map(user => ({
            user_id: user.id,
            title,
            message,
            notification_type,
            related_order_id,
            is_email,
            is_sms
        }));

        // массовое создание записей в Notification
        await Notification.bulkCreate(notifications);

        // рассылка email / sms
        for (const user of users) {
            const shouldSendEmail = ['payment', 'contract'].includes(notification_type) || is_email;
            const shouldSendSms = ['payment', 'contract'].includes(notification_type) || is_sms;

            if (shouldSendEmail && user.email) {
                await this.sendEmail(user.email, title, message);
            }

            if (shouldSendSms && user.phone) {
                await this.sendSms(user.phone, message);
            }

            console.log(`📤 Уведомление отправлено user_id=${user.id}`);
        }
    }

    async sendEmail(to, subject, text) {
        const msg = {
            to,
            from: fromEmail,
            subject,
            text,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error('❌ Ошибка при отправке email:', error.response?.body || error.message);
        }
    }

    async sendSms(phone, text) {
        try {
            const result = await mobizon.sendSms(phone, text);
            console.log('📨 Ответ Mobizon:', result);
            if (result.code !== 0) {
                console.error(`❌ Ошибка Mobizon: ${result.message}`);
            }
        } catch (error) {
            console.error('❌ Ошибка при отправке SMS:', error.response?.data || error.message);
        }
    }

    async getAllNotifications(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Notification.findAndCountAll({
            offset,
            limit,
            order: [['created_at', 'DESC']], // <--- исправлено
        });

        return {
            notifications: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }



    async getNotificationById(id) {
        return Notification.findAll({
            where: { user_id: id }
        });
    }


    async markAsRead(id) {
        await Notification.update({ is_read: true }, { where: { notification_id: id } });
        return this.getNotificationById(id);
    }

    async deleteNotification(id) {
        return Notification.destroy({ where: { notification_id: id } });
    }
}

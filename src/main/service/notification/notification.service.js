import Notification from '../../models/Notification.js';
import User from '../../models/User.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import MobizonApi from "../../utils/mobizon/Mobizon.js";
import {UserNotification} from "../../models/init/index.js";

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

        const user = await User.findByPk(user_id);
        if (!user) {
            console.log(`❌ Пользователь с id=${user_id} не найден`);
            return;
        }

        // Шаг 1: создаём уведомление (общее)
        const notification = await Notification.create({
            title,
            message,
            notification_type,
            related_order_id,
            is_email,
            is_sms,
            for_all: false,
        });

        // Шаг 2: создаём связь user_notification
        await UserNotification.create({
            user_id: user.id,
            notification_id: notification.notification_id,
            is_read: false,
        });

        // Шаг 3: отправляем email и/или sms
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
                                   user_ids = [],
                                   isToAll = false,
                                   title,
                                   message,
                                   notification_type,
                                   is_email = false,
                                   is_sms = false,
                                   related_order_id = null
                               }) {
        let users;

        if (isToAll) {
            users = await User.findAll(); // всем
        } else {
            users = await User.findAll({ where: { id: user_ids } });
        }

        if (!users || users.length === 0) {
            console.warn('❗ Нет пользователей для уведомления');
            return;
        }

        const notification = await Notification.create({
            title,
            message,
            notification_type,
            related_order_id,
            is_email,
            is_sms,
            for_all: isToAll,
        });

        const userNotifications = users.map(user => ({
            user_id: user.id,
            notification_id: notification.notification_id,
        }));
        await UserNotification.bulkCreate(userNotifications);

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



    async getNotificationsByUserId(user_id) {
        return UserNotification.findAll({
            where: { user_id },
            include: [
                {
                    model: Notification,
                    required: true, // только если уведомление существует
                }
            ],
            order: [['id', 'DESC']],
        });
    }

    async markAsRead(user_id, notification_id) {
        await UserNotification.update(
            { is_read: true },
            {
                where: {
                    user_id,
                    notification_id,
                },
            }
        );
        return this.getNotificationsByUserId(user_id);
    }


    async deleteNotification(id) {
        return Notification.destroy({ where: { notification_id: id } });
    }
}

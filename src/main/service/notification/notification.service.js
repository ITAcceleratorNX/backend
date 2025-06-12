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

        const notification = await Notification.create({
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

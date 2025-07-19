import {Order} from '../../../models/init/index.js';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import {NotificationService} from "../../notification/notification.service.js";

const notificationService = new NotificationService();

export async function markOrdersWith10DaysLeftAsPending() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    try {
        const orders = await Order.findAll({
            where: {
                end_date: {
                    [Op.between]: [start, end]
                },
                extension_status: 'NO'
            }
        });

        for (const order of orders) {
            order.extension_status = 'PENDING';
            await order.save();

            await notificationService.sendNotification({
                user_id: order.user_id,
                title: 'Продление заказа',
                message: `Срок аренды по вашему заказу #${order.id} истекает через 10 дней. 
                Вы можете продлить аренду вручную в личном кабинете. 
                Если вы не сделаете выбор до окончания срока, заказ будет автоматически продлён на 1 месяц.`,
                notification_type: 'general',
                related_order_id: order.id,
                is_email: true,
                is_sms: true
            });
        }

        console.log(`Updated ${orders.length} orders to extension_status: PENDING and sent notifications.`);
    } catch (error) {
        console.error('Error processing orders:', error);
    }
}
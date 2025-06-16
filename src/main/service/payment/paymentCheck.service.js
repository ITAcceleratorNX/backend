import { Op } from 'sequelize';
import { OrderPayment, Order, User } from '../../models/init/index.js';
import { NotificationService } from '../notification/notification.service.js';
import dayjs from 'dayjs';

export async function notifyManualPaymentsAfter10Days() {
    const notificationService = new NotificationService();
    const tenDaysAgo = dayjs().subtract(10, 'day').toDate();

    const manualPayments = await OrderPayment.findAll({
        where: {
            status: 'MANUAL',
            paid_at: {
                [Op.lte]: tenDaysAgo
            }
        },
        include: [
            {
                model: Order,
                as: 'order',
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            }
        ]
    });

    for (const payment of manualPayments) {
        const user = payment.order?.user;
        if (!user) continue;

        await notificationService.sendNotification({
            user_id: user.id,
            title: 'Напоминание об оплате',
            message: `Ваш платёж за заказ #${payment.order_id} всё ещё не оплачен. Пожалуйста, завершите оплату в Extraspace.`,
            notification_type: 'payment',
            related_order_id: payment.id,
            is_email: true,
            is_sms: true
        });

        console.log(`📨 Напоминание отправлено: user_id ${user.id}, order_payment ${payment.id}`);
    }
}
export async function handleLateManualPayments() {
    const notificationService = new NotificationService();
    const today = dayjs();

    const manualPayments = await OrderPayment.findAll({
        where: { status: 'MANUAL' },
        include: [
            {
                model: Order,
                as: 'order',
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            }
        ]
    });

    for (const payment of manualPayments) {
        const user = payment.order?.user;
        const order = payment.order;

        if (!user || !payment.paid_at) continue;

        const daysLate = today.diff(dayjs(payment.paid_at), 'day');

        if (daysLate > 30) {
            const penaltyDays = daysLate - 30;
            const penaltyPercentPerDay = 0.005;
            const penaltyAmount = Number((parseFloat(payment.amount) * penaltyPercentPerDay * penaltyDays).toFixed(2));
            payment.penalty_amount = penaltyAmount;
            await payment.save();

            await notificationService.sendNotification({
                user_id: user.id,
                title: 'Начислен штраф за просрочку',
                message: `Вы не оплатили заказ #${payment.order_id} более ${daysLate} дней. Начислена пеня: ${penaltyAmount} ₸. Пожалуйста, оплатите как можно скорее.`,
                notification_type: 'payment',
                related_order_id: payment.id,
                is_email: true,
                is_sms: true
            });

            console.log(`💸 Начислена пеня ${penaltyAmount}₸ для payment_id ${payment.id}`);
        }

        if (daysLate > 60 && order.status !== 'INACTIVE') {
            order.status = 'INACTIVE';
            await order.save();

            await notificationService.sendNotification({
                user_id: user.id,
                title: 'Контракт расторгнут',
                message: `Ваш контракт по заказу #${payment.order_id} был расторгнут из-за неуплаты более 2 месяцев.`,
                notification_type: 'contract',
                related_order_id: payment.id,
                is_email: true,
                is_sms: true
            });

            console.log(`📛 Контракт расторгнут для order_id ${order.id}`);
        }
    }
}

import {Order, OrderPayment} from '../../../models/init/index.js';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import {NotificationService} from "../../notification/notification.service.js";
import logger from "../../../utils/winston/logger.js";
import * as orderService from "../../../service/order/OrderService.js";
import * as refundService from "../../../service/payment/refund.service.js";

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

        logger.info(`Updated ${orders.length} orders to extension_status: PENDING and sent notifications.`);
    } catch (error) {
        logger.error('Error processing orders:', error);
    }
}

export async function autoExtendPendingOrders() {
    try {
        const orders = await Order.findAll({
            where: {
                extension_status: 'PENDING',
                end_date: {
                    [Op.lt]: new Date()
                }
            }
        });

        for (const order of orders) {
            try {
                await orderService.extendOrder({
                    order_id: order.id,
                    months: 1
                }, order.user_id);
                order.extension_status = 'NO';
                await order.save();
            } catch (error) {
                logger.error(error)
                continue;
            }

            await notificationService.sendNotification({
                user_id: order.user_id,
                title: 'Автоматическое продление заказа',
                message: `Ваш заказ #${order.id} был автоматически продлён на 1 месяц.`,
                notification_type: 'general',
                related_order_id: order.id,
                is_email: true,
                is_sms: true
            });
        }

        logger.info(`Auto-extended ${orders.length} pending orders.`);
    } catch (error) {
        logger.error('Error auto-extending orders:', error);
    }
}

export async function markExpiredOrdersAsFinished() {
    try {
        const orders = await Order.findAll({
            where: {
                end_date: {
                    [Op.lt]: new Date()
                },
                extension_status: {
                    [Op.not]: 'CANCELED'
                }
            }
        });

        for (const order of orders) {
            try {
                const payment = await OrderPayment.findOne({
                    where: {
                        order_id: order.id,
                        payment_id: {
                            [Op.not]: null,
                        }
                    },
                    order: [
                        ['paid_at', 'ASC'],
                    ]
                });
                if (!payment) {
                    logger.warn(`No valid payment found for order #${order.id}`);
                    continue;
                }

                await refundService.refundPayment(payment.payment_id);
                order.status = 'FINISHED';
                await order.save();
            } catch (error) {
                logger.error(error)
            }
        }

        logger.info(`Marked ${orders.length} expired orders as FINISHED.`);
    } catch (error) {
        logger.error('Error marking expired orders as FINISHED:', error);
    }
}

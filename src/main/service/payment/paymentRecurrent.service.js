import axios from 'axios';
import crypto from 'crypto';
import { Order, OrderPayment, User } from '../../models/init/index.js';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import {NotificationService} from "../notification/notification.service.js";

const API_URL = 'https://api.paysage.kz/payment/recurrent';
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

export async function runMonthlyPayments() {
    const now = dayjs();
    const currentMonth = now.month() + 1;
    const currentYear = now.year();
    const notificationService = new NotificationService();

    const unpaidPayments = await OrderPayment.findAll({
        where: {
            status: 'UNPAID',
            month: currentMonth,
            year: currentYear
        },
        include: [
            {
                model: Order,
                include: [User]
            }
        ]
    });

    for (const payment of unpaidPayments) {
        const user = payment.Order?.User;

        if (!user || !user.recurrent_token) {
            console.log(`⚠️ Пропущено: нет токена для user_id ${payment.user_id}`);
            continue;
        }

        const payload = {
            token: user.recurrent_token,
            amount: Number(parseFloat(payment.amount).toFixed(2)),
            order_id: String(payment.id),
            description: `Auto-payment for order ${payment.order_id}`
        };
        console.log(payload);
        console.log(typeof payload.amount);
        const dataJson = JSON.stringify(payload);
        const dataBase64 = Buffer.from(dataJson).toString('base64');
        const sign = crypto.createHmac('sha512', SECRET_KEY).update(dataBase64).digest('hex');
        const token = Buffer.from(API_KEY).toString('base64');
        try {
            const response = await axios.post(API_URL, {
                data: dataBase64,
                sign: sign
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const resData = response.data;

            if (resData.payment_status === 'success') {
                payment.status = 'PAID';
                payment.paid_at = new Date();
                payment.payment_id = resData.payment_id;
                await payment.save();
                console.log(`✅ Оплачено: order_id ${payment.order_id}`);
            } else {
                console.log(`❌ Ошибка оплаты: ${resData.error_msg || resData.error_code}`);
                if (resData.error_code === 'card_not_found') {
                    await notificationService.sendNotification({
                        user_id: user.id,
                        title: 'Ошибка оплаты',
                        message: 'Платёжная карта клиента не найдена. Проверьте реквизиты.',
                        notification_type: 'payment',
                        related_order_id: payment.order_id,
                        is_email: true,
                        is_sms: true
                    });
                }else {
                    await notificationService.sendNotification({
                        user_id: 1,
                        title: 'Ошибка оплаты',
                        message: 'Ошибка оплаты сервера',
                        notification_type: 'payment',
                        related_order_id: payment.order_id,
                        is_email: true,
                        is_sms: true
                    });
                }
            }
        } catch (err) {
            console.error(`❌ Ошибка запроса для order ${payment.order_id}:`, err.response?.data || err.message);
        }
    }
}

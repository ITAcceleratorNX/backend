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
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            }
        ]
    });

    for (const payment of unpaidPayments) {
        const user = payment.Order?.user;

        if (!user || !user.recurrent_token) {
            console.log(`⚠️ Пропущено: нет токена для user_id ${payment.user_id}`);
            continue;
        }

        const payload = {
            token: user.recurrent_token,
            amount: Number(parseFloat(payment.amount).toFixed(2)),
            order_id: String(707),
            description: `Auto-payment for order ${payment.order_id}`,
            test_mode: 1
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
            console.log(response.data);
            const resData = response.data;
                if (resData.success) {
                    const generatedSign = crypto
                        .createHmac('sha512', SECRET_KEY)
                        .update(resData.data)
                        .digest('hex');
                    if (generatedSign === resData.sign) {
                        console.log('✅ Подпись подтверждена, данные подлинные');
                        console.log(resData);
                        payment.status = 'PAID';
                        payment.paid_at = new Date();
                        payment.payment_id = resData.payment_id;
                        await payment.save();
                        await notificationService.sendNotification({
                            user_id: user.id,
                            title: 'Оплата прошла успешно',
                            message: 'Спасибо, что пользуетесь Extraspace! С вашего счёта успешно списана ежемесячная оплата. Хорошего дня!',
                            notification_type: 'payment',
                            related_order_id: payment.id,
                            is_email: true,
                            is_sms: true
                        });
                        console.log(`✅ Оплачено: order_id ${payment.id}`);
                    }else {
                        await notificationService.sendNotification({
                            user_id: 9,
                            title: 'Подозрение на взлом оплаты',
                            message: '⚠️ Обнаружено несоответствие подписи при обработке платежа. Проверьте безопасность сервиса Extraspace.',
                            notification_type: 'payment',
                            related_order_id: payment.id,
                            is_email: true,
                            is_sms: true
                        });
                    }
                }else {
                    console.log(`❌ Ошибка оплаты: ${resData}`);
                    if (
                        [
                            'ov_card_not_found',
                            'ov_card_incorrect_data',
                            'provider_card_incorrect',
                            'provider_card_expired',
                            'provider_send_otp_error',
                            'provider_incorrect_otp_error',
                            'ov_send_otp_error',
                            'ov_incorrect_otp',
                            'provider_insufficient_balance',
                            'provider_limit_error',
                            'ov_email_required'
                        ].includes(resData.error_code)
                    ) {
                        payment.status = 'MANUAL';
                        payment.paid_at = new Date();
                        payment.payment_id = resData.payment_id;
                        await payment.save();
                        await notificationService.sendNotification({
                            user_id: user.id,
                            title: 'Ошибка оплаты',
                            message: 'Не удалось списать оплату: платёжная карта не найдена. Пожалуйста, обновите реквизиты в вашем профиле Extraspace.',
                            notification_type: 'payment',
                            related_order_id: payment.id,
                            is_email: true,
                            is_sms: true
                        });
                    } else {
                        await notificationService.sendNotification({
                            user_id: 9,
                            title: 'Ошибка сервера при оплате',
                            message: '❌ В процессе автосписания в системе Extraspace возникла ошибка. Требуется проверка серверной стороны.',
                            notification_type: 'payment',
                            related_order_id: payment.id,
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

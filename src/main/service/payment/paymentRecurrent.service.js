import axios from 'axios';
import crypto from 'crypto';
import {Order, OrderPayment, Transaction, User} from '../../models/init/index.js';
import dayjs from 'dayjs';
import {Buffer} from 'buffer';
import {NotificationService} from '../notification/notification.service.js';
import {sequelize} from "../../config/database.js";
import JSONbig from "json-bigint";
import logger from "../../utils/winston/logger.js";
import {tryClearingAsync} from "./clearing.service.js";

const API_URL = process.env.ONE_VISION_API_URL_RECURRENT;
const API_KEY = process.env.PAYMENT_API_KEY;
const SECRET_KEY = process.env.PAYMENT_SECRET_KEY;

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

    for (const payment of unpaidPayments) {
        const user = payment.order?.user;
        if (!user || !user.recurrent_token) {
            payment.status = 'MANUAL';
            await payment.save();
            logger.warn(`⚠️ Пропущено: нет токена для user_id ${payment.order.user_id}`);
            continue;
        }

        const t = await sequelize.transaction();
        try {
            const transaction = await Transaction.create({
                order_payment_id: payment.id,
                payment_type: 'pay',
                amount: Number(parseFloat(payment.amount + payment.penalty_amount).toFixed(2)),
                recurrent_token: user.recurrent_token,
                created_date: new Date()
            }, { transaction: t });

            const payload = {
                token: user.recurrent_token,
                amount: Number(parseFloat(payment.amount + payment.penalty_amount).toFixed(2)),
                order_id: String(transaction.id),
                description: `Auto-payment for order ${payment.order_id}`,
                test_mode: 1
            };

            const dataJson = JSON.stringify(payload);
            const dataBase64 = Buffer.from(dataJson).toString('base64');
            const sign = crypto.createHmac('sha512', SECRET_KEY).update(dataBase64).digest('hex');
            const token = Buffer.from(API_KEY).toString('base64');

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

            if (resData.success) {
                const generatedSign = crypto.createHmac('sha512', SECRET_KEY).update(resData.data).digest('hex');

                if (generatedSign === resData.sign) {
                    const decodedData = JSONbig.parse(Buffer.from(resData.data, 'base64').toString());

                    transaction.operation_status = 'success';
                    transaction.payment_id = decodedData.payment_id || null;
                    transaction.payment_date = decodedData.created_date || new Date().toISOString();
                    transaction.recurrent_token = decodedData.recurrent_token || transaction.recurrent_token;
                    transaction.payer_info = JSON.stringify(decodedData.payer_info || {});
                    await transaction.save({ transaction: t });

                    payment.status = 'PAID';
                    payment.paid_at = new Date();
                    payment.payment_id = decodedData.payment_id?.toString();
                    await payment.save({ transaction: t });

                    await t.commit();

                    tryClearingAsync(String(payment.payment_id), Number(transaction.amount), transaction.id);
                    await notificationService.sendNotification({
                        user_id: user.id,
                        title: 'Оплата прошла успешно',
                        message: 'Спасибо, что пользуетесь Extraspace! С вашего счёта успешно списана ежемесячная оплата.',
                        notification_type: 'payment',
                        related_order_id: payment.id,
                        is_email: true,
                        is_sms: true
                    });
                } else {
                    transaction.operation_status = 'error';
                    await transaction.save({ transaction: t });
                    await t.commit();

                    await notificationService.sendNotification({
                        user_id: 9,
                        title: 'Подозрение на взлом оплаты',
                        message: '⚠️ Несоответствие подписи при обработке платежа. Проверьте безопасность сервиса Extraspace.',
                        notification_type: 'payment',
                        related_order_id: payment.id,
                        is_email: true,
                        is_sms: true
                    });
                }

            } else {
                logger.error(`❌ Ошибка оплаты: ${resData}`);

                transaction.operation_status = 'FAILED';
                transaction.error_code = resData.error_code || null;
                await transaction.save({ transaction: t });

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
                    await payment.save({ transaction: t });
                }

                await t.commit();

                await notificationService.sendNotification({
                    user_id: user.id,
                    title: 'Ошибка оплаты',
                    message: 'Не удалось списать оплату: платёжная карта не найдена. Пожалуйста, обновите реквизиты в вашем профиле.',
                    notification_type: 'payment',
                    related_order_id: payment.id,
                    is_email: true,
                    is_sms: true
                });
            }

        } catch (err) {
            console.error(`❌ Ошибка запроса для order ${payment.order_id}:`, err.response?.data || err.message);

            await t.rollback();
            payment.status = 'MANUAL';
            payment.paid_at = new Date();
            await payment.save();
            await notificationService.sendNotification({
                user_id: 9,
                title: 'Ошибка оплаты',
                message: 'Не удалось выполнить автоматическую оплату.',
                notification_type: 'general',
                related_order_id: payment.id,
                is_email: true,
                is_sms: false
            });
            await notificationService.sendNotification({
                user_id: user.id,
                title: 'Ошибка оплаты',
                message: 'Не удалось выполнить автоматическую оплату.',
                notification_type: 'payment',
                related_order_id: payment.id,
                is_email: true,
                is_sms: true
            });
            if (err.transaction?.id) {
                err.transaction.operation_status = 'error';
                err.transaction.error_code = err.message;
                await err.transaction.save();
            }
        }
    }
}

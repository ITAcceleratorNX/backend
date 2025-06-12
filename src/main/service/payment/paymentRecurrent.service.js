import axios from 'axios';
import crypto from 'crypto';
import { Order, OrderPayment, User } from '../../models/init/index.js';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';

const API_URL = 'https://api.paysage.kz/payment/recurrent';
const API_KEY = 'cb91f50f-c520-4cd7-a846-7488e3294f18';
const SECRET_KEY = '4ec7fe887bb9e205164eb1be4c3b942eb6f752d7c02c6fb15de39bdce0310bda';

export async function runMonthlyPayments() {
    const now = dayjs();
    const currentMonth = now.month() + 1;
    const currentYear = now.year();

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
            order_id: String(payment.order_id),
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
            }
        } catch (err) {
            console.error(`❌ Ошибка запроса для order ${payment.order_id}:`, err.response?.data || err.message);
        }
    }
}

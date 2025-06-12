import axios from "axios";
import logger from "../../utils/winston/logger.js";
import {Buffer} from 'buffer';
import crypto from "crypto";
import {Order, OrderPayment, Storage, User} from "../../models/init/index.js";
import {DateTime} from "luxon";
import * as priceService from "../price/PriceService.js";
import * as orderPaymentService from "../order_payments/OrderPaymentsService.js";
import {sequelize} from "../../config/database.js";


const PAYMENT_CONSTANTS = {
    currency: 'KZT',
    success_url: 'https://frontend-6j9m.onrender.com/personal-account',
    failure_url: 'https://frontend-6j9m.onrender.com/personal-account',
    callback_url: 'https://extraspace-backend.onrender.com/callbacks/payment-callback',
    merchant_term_url: 'https://frontend-6j9m.onrender.com',
    payment_lifetime: 3600,
    lang: 'ru',
    merchant_id: '494407cd-25b7-40b9-916e-17293a705638',
    service_id: '4ab57c07-f271-4a39-a654-c673bfcd09c9',
    merchant_name: 'Extraspace',
    name: 'storage',
    secretKey: '4ec7fe887bb9e205164eb1be4c3b942eb6f752d7c02c6fb15de39bdce0310bda',
    apiKey: 'cb91f50f-c520-4cd7-a846-7488e3294f18',
    payment_type: 'pay',
    payment_method: 'ecom',
    payment_create_url: 'https://api.paysage.kz//payment/create'
};

export const create = async (data) => {
    const paymentOrderTransaction = await sequelize.transaction();
    const orderPayments = [];

    try {
        const order = await Order.findOne({
            where: { id: data.order_id },
            include: [
                {
                    model: Storage,
                    as: 'storage'
                },
                {
                    model: User,
                    as: 'user'
                }
            ]
        });
        if (!order) {
            const error = new Error('order not found');
            error.status = 200;
            throw error;
        } else if(order.status !== 'APPROVED') {
            const error = new Error('payment cannot start without approval');
            error.status = 409;
            throw error;
        }
        const start = DateTime.fromJSDate(order.start_date);
        const end = DateTime.fromJSDate(order.end_date);
        const totalDays = end.diff(start, 'days').days;
        const dailyAmount = order.total_price / totalDays;

        let current = start;
        let remaining = totalDays;
        let isFirst = true;

        const deposit = await priceService.getByType('DEPOSIT');

        while (remaining > 0) {
            const daysInMonth = current.daysInMonth;
            const startDay = current.day;
            const daysThisMonth = daysInMonth - startDay + 1;

            const daysToCharge = Math.min(remaining, daysThisMonth);
            const amount = dailyAmount * daysToCharge;

            orderPayments.push({
                order_id: order.id,
                month: current.month,
                year: current.year,
                amount: amount + (isFirst ? Number(deposit.price) : 0),
                status: 'UNPAID',
            });

            isFirst = false;
            remaining -= daysToCharge;
            current = current.plus({ months: 1 }).set({ day: 1 });
        }

        const createdOrderPayments = await orderPaymentService.bulkCreate(orderPayments, { paymentOrderTransaction });
        const updatedStorageData = {
            status: order.storage.available_volume <= 0 ? 'OCCUPIED' : 'VACANT',
        };
        await Storage.update(updatedStorageData, {
            where: { id: order.id },
            paymentOrderTransaction,
        });

        await Order.update({status: 'PROCESSING'}, {
            where: {id: order.id},
            paymentOrderTransaction
        })

        const dataObject = {
            amount: Number(orderPayments[0].amount),
            currency: PAYMENT_CONSTANTS.currency,
            order_id: String(createdOrderPayments[0].id),
            description: 'First payment for order',
            payment_type: PAYMENT_CONSTANTS.payment_type,
            payment_method: PAYMENT_CONSTANTS.payment_method,
            email: order.user.email,
            success_url: PAYMENT_CONSTANTS.success_url,
            failure_url: PAYMENT_CONSTANTS.failure_url,
            callback_url: PAYMENT_CONSTANTS.callback_url,
            merchant_term_url: PAYMENT_CONSTANTS.merchant_term_url,
            payment_lifetime: Number(PAYMENT_CONSTANTS.payment_lifetime),
            lang: PAYMENT_CONSTANTS.lang,
            items: [
                {
                    merchant_id: PAYMENT_CONSTANTS.merchant_id,
                    service_id: PAYMENT_CONSTANTS.service_id,
                    merchant_name: PAYMENT_CONSTANTS.merchant_name,
                    name: PAYMENT_CONSTANTS.name,
                    quantity: 1,
                    amount_one_pcs: Number(orderPayments[0].amount),
                    amount_sum: Number(orderPayments[0].amount),
                }
            ]
        };

        const dataJson = JSON.stringify(dataObject);
        const dataBase64 = Buffer.from(dataJson).toString('base64');

        const sign = crypto
            .createHmac('sha512', PAYMENT_CONSTANTS.secretKey)
            .update(dataBase64)
            .digest('hex');

        const requestBody = {
            data: dataBase64,
            sign: sign,
        };

        const token = Buffer.from(PAYMENT_CONSTANTS.apiKey).toString('base64');
        const headers = {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(PAYMENT_CONSTANTS.payment_create_url, requestBody, { headers });
            logger.info('Payment API response', {
                message: 'Payment API response',
                endpoint: 'payment/create',
                service: 'PaymentService',
                requestId: data?.requestId,
                userId: order.user.id,
                response: response.data
            });
            console.log("Payment API response", response)
        } catch (error) {
            logger.error('Payment API error', {
                message: error.message,
                endpoint: 'payment/create',
                service: 'PaymentService',
                requestId: data?.requestId,
                userId: order?.user?.id || null
            });
            throw error;
        }

        await paymentOrderTransaction.commit();
        return order;
    } catch (err) {
        await paymentOrderTransaction.rollback();
        throw err;
    }
};

export const getByUserId = async (user_id) => {
    return await OrderPayment.findAll({where: {user_id: user_id}});
}
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
    currency: process.env.PAYMENT_CURRENCY,
    success_url: process.env.PAYMENT_SUCCESS_URL,
    failure_url: process.env.PAYMENT_FAILURE_URL,
    callback_url: process.env.PAYMENT_CALLBACK_URL,
    merchant_term_url: process.env.PAYMENT_MERCHANT_TERM_URL,
    payment_lifetime: Number(process.env.PAYMENT_LIFETIME),
    lang: process.env.PAYMENT_LANG,
    merchant_id: process.env.PAYMENT_MERCHANT_ID,
    service_id: process.env.PAYMENT_SERVICE_ID,
    merchant_name: process.env.PAYMENT_MERCHANT_NAME,
    name: process.env.PAYMENT_NAME,
    secretKey: process.env.PAYMENT_SECRET_KEY,
    apiKey: process.env.PAYMENT_API_KEY,
    payment_type: process.env.PAYMENT_TYPE,
    payment_method: process.env.PAYMENT_METHOD,
    payment_create_url: process.env.PAYMENT_CREATE_URL
};

function generateOrderPayments(order, deposit) {
    const start = DateTime.fromJSDate(order.start_date);
    const end = DateTime.fromJSDate(order.end_date);
    const totalDays = end.diff(start, 'days').days;
    const dailyAmount = order.total_price / totalDays;

    const orderPayments = [];
    let current = start;
    let remaining = totalDays;
    let isFirst = true;

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

    return { orderPayments, totalDays };
}

function buildPaymentRequest(order, amount, orderPaymentId, totalDays) {
    const dataObject = {
        amount: Number(amount),
        currency: PAYMENT_CONSTANTS.currency,
        order_id: String(orderPaymentId),
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
        create_recurrent_profile: true,
        recurrent_profile_lifetime: Number(totalDays),
        items: [
            {
                merchant_id: PAYMENT_CONSTANTS.merchant_id,
                service_id: PAYMENT_CONSTANTS.service_id,
                merchant_name: PAYMENT_CONSTANTS.merchant_name,
                name: PAYMENT_CONSTANTS.name,
                quantity: 1,
                amount_one_pcs: Number(amount),
                amount_sum: Number(amount),
            }
        ]
    };

    const dataJson = JSON.stringify(dataObject);
    const dataBase64 = Buffer.from(dataJson).toString('base64');
    const sign = crypto
        .createHmac('sha512', PAYMENT_CONSTANTS.secretKey)
        .update(dataBase64)
        .digest('hex');
    const token = Buffer.from(PAYMENT_CONSTANTS.apiKey).toString('base64');
    const headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    return { requestBody: { data: dataBase64, sign }, headers };
}

export const create = async (data) => {
    const paymentOrderTransaction = await sequelize.transaction();

    try {
        const order = await Order.findOne({
            where: { id: data.order_id },
            include: [
                { model: Storage, as: 'storage' },
                { model: User, as: 'user' }
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
        const deposit = await priceService.getByType('DEPOSIT');
        const { orderPayments, totalDays } = generateOrderPayments(order, deposit);
        const createdOrderPayments = await orderPaymentService.bulkCreate(orderPayments, { transaction: paymentOrderTransaction });

        await Order.update({ status: 'PROCESSING' }, {
            where: { id: order.id },
            transaction: paymentOrderTransaction,
        });

        const { requestBody, headers } = buildPaymentRequest(
            order,
            orderPayments[0].amount,
            createdOrderPayments[0].id,
            totalDays
        );
        let response;
        try {
            response = await axios.post(PAYMENT_CONSTANTS.payment_create_url, requestBody, { headers });
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
        return JSON.parse(Buffer.from(response.data.data, 'base64').toString('utf-8'));
    } catch (err) {
        await paymentOrderTransaction.rollback();
        throw err;
    }
};

export const getByUserId = async (user_id) => {
    return await Order.findAll({where: { user_id: user_id }}, {
        include: {
            model: OrderPayment,
            as: 'order_payment',
        }
    });
}
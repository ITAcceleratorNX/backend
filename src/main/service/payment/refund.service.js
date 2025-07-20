import crypto from 'crypto';
import axios from 'axios';
import {Buffer} from "buffer";
import logger from "../../utils/winston/logger.js";
import JSONbig from "json-bigint";

const API_KEY = process.env.PAYMENT_API_KEY;
const SECRET_KEY = process.env.PAYMENT_SECRET_KEY;
const PAYMENT_REFUND_URL = process.env.ONE_VISION_REFUND_URL;

export const refundPayment = async (id_payment, amount = 15000) => {
    try {
        const paymentRequest = {
            payment_id: id_payment,
            amount,
            description: "Возврат депозита"
        };

        const paymentData = JSONbig.stringify(paymentRequest);
        const requestDataBase64 = Buffer.from(paymentData, 'utf8').toString('base64');
        const hmac = crypto.createHmac('sha512', SECRET_KEY);
        hmac.update(requestDataBase64);
        const requestSignature = hmac.digest('hex');
        const token = Buffer.from(API_KEY).toString('base64');

        const response = await axios.post(PAYMENT_REFUND_URL, {
            request: requestDataBase64,
            sign: requestSignature
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const decoded = JSONbig.parse(Buffer.from(response.data, 'base64').toString('utf-8'));
        logger.info(`Decoded refunded payment`, {response: decoded});

        return decoded;
    } catch (error) {
        logger.error('Refund error:', {response: error?.response?.data || error.message});
        throw error;
    }
};
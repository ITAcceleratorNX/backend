import axios from "axios";
import {Transaction} from "../../models/init/index.js";
import logger from "../../utils/winston/logger.js";
import {Buffer} from "buffer";
import crypto from "crypto";
import JSONbig from "json-bigint";

export const retry = async (fn, retries = 3, delay = 2000) => {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        await new Promise(res => setTimeout(res, delay));
        return retry(fn, retries - 1, delay);
    }
};

export const sendClearingRequest = async ({ payment_id, amount }) => {
    const apiKey = process.env.PAYMENT_API_KEY;
    const secretKey = process.env.PAYMENT_SECRET_KEY;
    const clearingUrl = process.env.ONE_VISION_CLEARING_URL;

    payment_id = BigInt(payment_id);

    const requestBody = { payment_id, amount };
    const dataJson = JSONbig.stringify(requestBody);
    const dataBase64 = Buffer.from(dataJson).toString('base64');

    const sign = crypto
        .createHmac('sha512', secretKey)
        .update(dataBase64)
        .digest('hex');

    const token = Buffer.from(apiKey).toString('base64');

    const headers = {
        Authorization: 'Bearer ' + token
    };

    let response;
    try {
        response = await axios.post(clearingUrl, {
            data: dataBase64,
            sign
        }, { headers });
    } catch (err) {
        logger.error("retry error", {response: err});
        throw err;
    }

    return response.data;
};

export const tryClearingAsync = async (payment_id, amount, order_id) => {
    (async () => {
        try {
            const response = await retry(() => sendClearingRequest({ payment_id: String(payment_id), amount }));
            logger.info(`Clearing successful for payment_id: ${payment_id}`, { response });
            await Transaction.update({ clearing_status: 'SUCCESS' }, { where: { id: order_id } });
        } catch (err) {
            logger.error(`Clearing failed for payment_id: ${payment_id}`, { response: err.message });
            await Transaction.update({ clearing_status: 'FAILED' }, { where: { id: order_id } });
        }
    })();
};

export const clearingRetryJob = async () => {
    logger.info("Запуск cron-задачи: повтор клиринга для FAILED");

    const failedTransactions = await Transaction.findAll({
        where: { clearing_status: 'FAILED' }
    });

    for (const tx of failedTransactions) {
        try {
            const { payment_id, amount, id: order_id } = tx;
            const result = await sendClearingRequest({ payment_id, amount });
            await Transaction.update({ clearing_status: 'SUCCESS' }, { where: { id: order_id } });

            logger.info(`Клиринг успешен при повторной попытке: ${payment_id}`, { response: result });
        } catch (err) {
            logger.error(`Клиринг снова не удался: ${tx.payment_id}`, { response: err });
        }
    }

    logger.info(`Завершено: ${failedTransactions.length} транзакций обработано.`);
};
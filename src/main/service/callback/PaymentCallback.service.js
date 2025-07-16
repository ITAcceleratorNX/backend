import {sequelize} from "../../config/database.js";
import logger from "../../utils/winston/logger.js";
import {Order, OrderPayment, Transaction, User} from "../../models/init/index.js";
import {NotificationService} from "../notification/notification.service.js";
import {Op} from "sequelize";
import { tryClearingAsync } from "../payment/clearing.service.js";

const notificationService = new NotificationService();

export const handleCallbackData = async (data) => {
    const {
        order_id,
        operation_type,
        operation_status
    } = data;

    if (operation_status === 'error') {
        await handleErrorStatus(data);
    } else if (operation_status === 'success') {
        switch (operation_type) {
            case 'withdraw':
                logger.info("withdraw callback received")
                await handleWithdraw(data);
                break;
            default:
                logger.warn(`Unknown operation_type: ${operation_type} for order_id: ${order_id}, data: ${data}`);
                break;
        }
    } else {
        logger.warn(`Unknown operation_type: ${operation_type}`, data);
    }
};

const handleErrorStatus = async (data) => {
    switch (data.error_code) {
        case 'provider_common_error':
            logger.warn(`Order ${data.order_id}: Common provider error occurred. error_code: ${data.error_code}`);
            await handleProviderCommonError(data);
            break;
        case 'ov_server_error':
            logger.warn(`Order ${data.order_id}: OneVision server error. error_code: ${data.error_code}`);
            await handleServerError(data);

            break;
        case 'ov_card_incorrect_data':
            logger.warn(`Order ${data.order_id}: Incorrect card data provided. error_code: ${data.error_code}`);
            await handlePaymentCardIncorrect(data);
            break;
        case 'ov_payment_expired':
            logger.warn(`Order ${data.order_id}: Payment expired. error_code: ${data.error_code}`);
            await handlePaymentExpired(data);
            break;
        default:
            logger.warn(`Order ${data.order_id}: Unknown error code received - ${data.error_code}.`);
            await handleUnknownError(data);
    }
};

const handleWithdraw = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const transactionData = await Transaction.findByPk(String(data.order_id), {
            include: {
                model: OrderPayment,
                as: 'order_payment',
                include: {
                    model: Order,
                    as: 'order'
                }
            }
        });
        await Order.update({ payment_status: 'PAID' }, {
            where: { id: transactionData.order_payment.order.id },
            transaction
        });
        await OrderPayment.update({ status: 'PAID', payment_id: data.payment_id, paid_at: new Date(data.payment_date) }, {
            where: { id: transactionData.order_payment.id },
            transaction
        });
        await User.update({ recurrent_token: data.recurrent_token }, {
            where: { id: transactionData.order_payment.order.user_id },
            transaction
        });
        const transactionUpdateData = {
            payment_id: data.payment_id,
            operation_id: data.operation_id,
            payment_type: data.payment_type,
            operation_type: data.operation_type,
            operation_status: data.operation_status,
            error_code: data.error_code,
            recurrent_token: data.recurrent_token,
            amount: data.amount,
            created_date: isNaN(new Date(data.created_date).getTime()) ? null : new Date(data.created_date).toISOString(),
            payment_date: data.payment_date,
            payer_info: data.payer_info
        }
        await Transaction.update(transactionUpdateData, {
            where: { id: data.order_id },
            transaction
        })
        await transaction.commit();

    } catch (err) {
        await transaction.rollback();
        logger.error(`Error creating payment transaction, message: ${err.message}`, { error: err });
    }
    tryClearingAsync(data.payment_id, data.amount, data.order_id);
};

const handlePaymentExpired = async (data) => {
    await processManualErrorAndNotify(
        data,
        'Напоминание об оплате',
        `Платёж по заказу #ORDER_ID# не был завершён вовремя и истёк. Пожалуйста повторите попытку оплаты.`
    );
};

const handleProviderCommonError = async (data) => {
    await processManualErrorAndNotify(
        data,
        'Ошибка провайдера оплаты',
        `К сожалению, произошла ошибка со стороны провайдера при оплате заказа #ORDER_ID#. Пожалуйста, попробуйте снова.`
    );
};

const handleServerError = async (data) => {
    await processManualErrorAndNotify(
        data,
        'Ошибка на стороне сервера',
        `При обработке платежа по заказу #ORDER_ID# произошла ошибка сервера. Повторите попытку позже.`
    );
};

const handlePaymentCardIncorrect = async (data) => {
    await processManualErrorAndNotify(
        data,
        'Ошибка данных карты',
        `Платёж по заказу #ORDER_ID# не прошёл из-за неверных данных карты. Пожалуйста, проверьте информацию и повторите попытку.`
    );
};

const handleUnknownError = async (data) => {
    await processManualErrorAndNotify(
        data,
        'Ошибка на стороне сервера',
        `При обработке платежа по заказу #ORDER_ID# произошла ошибка сервера. Повторите попытку позже.`
    );
};

const updateTransactionData = (data) => {
    const parseDate = (value) => {
        if (typeof value === 'string') {
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date.toISOString();
        } else if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    };

    return {
        payment_id: data.payment_id,
        operation_id: data.operation_id,
        payment_type: data.payment_type,
        operation_type: data.operation_type,
        operation_status: data.operation_status,
        error_code: data.error_code,
        recurrent_token: data.recurrent_token,
        amount: data.amount,
        created_date: parseDate(data.created_date),
        payment_date: data.payment_date,
        payer_info: data.payer_info
    };
};

const fetchTransactionDataWithRelations = async (orderId) => {
    return Transaction.findByPk(String(orderId), {
        include: {
            model: OrderPayment,
            as: 'order_payment',
            include: {
                model: Order,
                as: 'order'
            }
        }
    });
};

const processManualErrorAndNotify = async (data, title, message) => {
    const transaction = await sequelize.transaction();
    try {
        const transactionData = await fetchTransactionDataWithRelations(data.order_id);
        const updateData = updateTransactionData(data);

        await Transaction.update(updateData, {
            where: { id: String(data.order_id) },
            transaction
        });
        await OrderPayment.update({ status: 'MANUAL' }, {
            where: { id: Number(transactionData.order_payment_id) },
            transaction
        });

        await transaction.commit();

        notificationService.sendNotification({
            user_id: transactionData.order_payment.order.user_id,
            title,
            message: message.replace('#ORDER_ID#', transactionData.order_payment.order.id),
            notification_type: 'payment',
            related_order_id: transactionData.order_payment.order.id,
            is_email: true,
            is_sms: true
        });
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const processCronJobForExpiredTransactions = async () => {
    const PAYMENT_LIFETIME = Number(process.env.PAYMENT_LIFETIME);
    console.log("PAYMENT_LIFETIME: ", PAYMENT_LIFETIME);
    const expirationCutoff = new Date(Date.now() - PAYMENT_LIFETIME * 1000);
    console.log("expirationCutoff: ", expirationCutoff);
    const expiredTransactions = await Transaction.findAll({
        where: {
            operation_status: null,
            created_date: { [Op.lt]: expirationCutoff }
        }
    });

    logger.info(
        `Found ${expiredTransactions.length} expired transactions older than 1 minute. 
                Transactions:${expiredTransactions.length}`
    );

    const datasToProcessing = expiredTransactions
        .map(tx => ({
            order_id: tx.id,
            operation_status: 'error',
            error_code: 'ov_payment_expired',
        }));

    for (const data of datasToProcessing) {
        handleCallbackData(data);
    }
}
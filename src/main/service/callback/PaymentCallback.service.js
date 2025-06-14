import {sequelize} from "../../config/database.js";
import logger from "../../utils/winston/logger.js";
import {Order, OrderPayment, Transaction, User} from "../../models/init/index.js";

export const handleCallbackData = async (data) => {
    const {
        order_id,
        operation_type,
        operation_status,
        error_code
    } = data;

    if (operation_status === 'error') {
        await handleErrorStatus(order_id, error_code);
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

const handleErrorStatus = async (order_id, error_code) => {
    switch (error_code) {
        case 'provider_common_error':
            logger.error(`Order ${order_id}: Common provider error occurred. error_code: ${error_code}`);
            break;
        case 'ov_server_error':
            logger.error(`Order ${order_id}: OneVision server error. error_code: ${error_code}`);
            break;
        case 'ov_card_incorrect_data':
            logger.error(`Order ${order_id}: Incorrect card data provided. error_code: ${error_code}`);
            break;
        case 'ov_payment_expired':
            logger.error(`Order ${order_id}: Payment expired. error_code: ${error_code}`);
            await handlePaymentExpired(order_id);
            break;
        default:
            logger.error(`Order ${order_id}: Unknown error code received - ${error_code}.`);
    }
};

const handleWithdraw = async (data) => {
    const transaction = await sequelize.transaction({
        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    });
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
            created_date: data.created_date,
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
};

const handlePaymentExpired = async (order_id) => {
    await OrderPayment.update({ status: 'MANUAL'}, {
        where: { id: Number(order_id) }
    })
}
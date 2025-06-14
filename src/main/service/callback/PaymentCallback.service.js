import {sequelize} from "../../config/database.js";
import logger from "../../utils/winston/logger.js";
import {Order, OrderPayment, User} from "../../models/init/index.js";

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
            case 'create':
                logger.info("create callback received")
                await handleCreate(data);
                break;
            case 'withdraw':
                logger.info("withdraw callback received")
                await handleCreate(data);
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
            break;
        default:
            logger.error(`Order ${order_id}: Unknown error code received - ${error_code}.`);
    }
};

const handleCreate = async ({ order_id, payment_id, payment_date, recurrent_token }) => {
    const transaction = await sequelize.transaction();
    try {
        const orderPayment = await OrderPayment.findByPk(Number(order_id), {
            include: {
                model: Order,
                as: 'order', // важно: alias должен совпадать с ассоциацией
            }
        });        await Order.update({ payment_status: 'PAID' }, {
            where: { id: order_id },
            transaction
        });
        await OrderPayment.update({ status: 'PAID', payment_id, paid_at: new Date(payment_date) }, {
            where: { id: order_id },
            transaction
        });
        await User.update({ recurrent_token }, {
            where: { id: orderPayment.order.user_id },
            transaction
        });
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        logger.error(`Error creating payment transaction, message: ${err.message}`, { error: err });
    }
};
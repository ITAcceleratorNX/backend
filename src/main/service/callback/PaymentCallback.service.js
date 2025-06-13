import orderRepository from '../db/order.repository.js';

export const handleCallbackData = async (data) => {
    const {
        order_id,
        operation_status,
        error_code,
        payment_id,
        amount
    } = data;

    if (operation_status === 'success') {
        await orderRepository.updateOrderStatus(order_id, 'paid');
        // Можно сохранить payment_id, сумму, дату и т.д.
    } else if (operation_status === 'error') {
        switch (error_code) {
            case 'provider_common_error':
                await orderRepository.updateOrderStatus(order_id, 'failed_common');
                break;
            case 'timeout':
                await orderRepository.updateOrderStatus(order_id, 'failed_timeout');
                break;
            case 'card_declined':
                await orderRepository.updateOrderStatus(order_id, 'declined');
                break;
            default:
                await orderRepository.updateOrderStatus(order_id, 'unknown_error');
        }
    }
};
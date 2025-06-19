import {MovingOrder} from '../../models/init/index.js';

export const createOrder = async (data) => {
    return await MovingOrder.create(data);
};

export const getAllOrders = async () => {
    return await MovingOrder.findAll();
};

export const getOrderById = async (id) => {
    return await MovingOrder.findByPk(id);
};

export const updateOrder = async (id, data) => {
    const order = await MovingOrder.findByPk(id);
    if (!order) return null;
    return await order.update(data);
};

export const deleteOrder = async (id) => {
    const order = await MovingOrder.findByPk(id);
    if (!order) return false;
    await order.destroy();
    return true;
};
